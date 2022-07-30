import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  ToastAndroid,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FloatingAction } from "react-native-floating-action";
import { Modal, Portal, Button, Provider, TextInput } from "react-native-paper";

const { width, height } = Dimensions.get("window");

const actions = [
  {
    text: "Add Plan",
    icon: <FontAwesome5 name="calendar" size={12} color={"#fff"} />,
    name: "AddPlan",
    position: 1,
  },
  {
    text: "Add Serice",
    icon: <FontAwesome5 name="briefcase" size={12} color={"#fff"} />,
    name: "AddService",
    position: 2,
  },
];

const MemberDetails = ({ route, navigation }) => {
  const [choice, setChoice] = useState("1");
  const [initializing, setInitializing] = useState(false);

  const [planSession, setPlanSession] = useState();
  const [visiblePlanForm, setVisiblePlanForm] = React.useState(false);
  const showModalPlanForm = () => setVisiblePlanForm(true);
  const hideModalPlanForm = () => setVisiblePlanForm(false);

  const [serviceSession, setServiceSession] = useState();
  const [visibleServiceForm, setVisibleServiceForm] = React.useState(false);
  const showModalServiceForm = () => setVisibleServiceForm(true);
  const hideModalServieForm = () => setVisibleServiceForm(false);

  const [amount, setAmount] = useState("");
  const [dueAmount, setDueAmount] = useState("");

  const { data } = route.params;

  var date = new Date(Date.UTC(1970, 0, 1)); // Epoch
  date.setUTCSeconds(data.dob.seconds);

  var dob =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

  var plan_expiry = "";

  const getPlanExpiry = (latestPlan) => {
    var plan_start = latestPlan.date;
    var duration = parseInt(latestPlan.duration);
    plan_start = new Date(plan_start);

    if (latestPlan.durationType == "Month") {
      plan_expiry = new Date(
        plan_start.setMonth(plan_start.getMonth() + duration)
      );
    } else {
      plan_expiry = new Date(
        plan_start.setDate(plan_start.getDate() + duration)
      );
    }

    plan_expiry =
      plan_expiry.getDate() +
      "/" +
      (plan_expiry.getMonth() + 1) +
      "/" +
      plan_expiry.getFullYear();

    return plan_expiry;
  };

  const banfun = async () => {
    console.log("pressed");
    const value = await AsyncStorage.getItem("GYM");
    try {
      firestore()
        .collection("GYM")
        .doc(value)
        .collection("MEMBERS")
        .doc(data.id)
        .update({
          block: true,
        })
        .then(() => {
          console.log("Blocked");
          ToastAndroid.show("Member Banned successfully!", ToastAndroid.SHORT);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const processPaymentForPlan = (index, plan) => {
    // console.log(index, plan);
    setAmount("");
    setPlanSession({ index, plan });
    setDueAmount(plan.amount - plan.discount - plan.amountPaid);
    showModalPlanForm();
  };

  const updatePlanInDB = async () => {
    const GYM_OWNER_EMAIL_ID = await AsyncStorage.getItem("GYM");

    setInitializing(true);

    var new_payment_amount = amount;
    var new_plan_obj = {
      durationType: planSession.plan.durationType,
      duration: planSession.plan.duration,
      plan: planSession.plan.plan,
      amount: planSession.plan.amount,
      amountPaid:
        parseInt(planSession.plan.amountPaid) + parseInt(new_payment_amount),
      discount: planSession.plan.discount,
      date: planSession.plan.date,
    };

    const arrayRemove = firestore.FieldValue.arrayRemove(
      JSON.stringify(planSession.plan)
    );
    const arrayAdd = firestore.FieldValue.arrayUnion(
      JSON.stringify(new_plan_obj)
    );

    await firestore()
      .collection("GYM")
      .doc(GYM_OWNER_EMAIL_ID)
      .collection("MEMBERS")
      .doc(data.id)
      .update({
        plans: arrayRemove,
      })
      .then(() => {});
    await firestore()
      .collection("GYM")
      .doc(GYM_OWNER_EMAIL_ID)
      .collection("MEMBERS")
      .doc(data.id)
      .update({
        plans: arrayAdd,
      })
      .then(() => {
        ToastAndroid.show("Updated successfully", ToastAndroid.SHORT);
      });

    const member = await firestore()
      .collection("GYM")
      .doc(GYM_OWNER_EMAIL_ID)
      .collection("MEMBERS")
      .doc(data.id)
      .get();

    // console.log(member);

    // console.log(planSession.plan);
    // console.log(new_plan_obj);
    setInitializing(false);
    setDueAmount("");
    setAmount("");
    setPlanSession();
    hideModalPlanForm();
    navigation.replace("MemberDetails", { data: member._data });
  };

  const processPaymentForService = (index, service) => {
    // console.log(index, plan);
    setAmount("");
    setServiceSession({ index, service });
    setDueAmount(service.amount - service.discount - service.amountPaid);
    showModalServiceForm();
  };

  const updateServiceInDB = async () => {
    const GYM_OWNER_EMAIL_ID = await AsyncStorage.getItem("GYM");

    setInitializing(true);

    var new_payment_amount = amount;
    var new_service_obj = {
      service: serviceSession.service.service,
      amountPaid:
        parseInt(serviceSession.service.amountPaid) +
        parseInt(new_payment_amount),
      discount: serviceSession.service.discount,
      amount: serviceSession.service.amount,
      date: serviceSession.service.date,
    };

    const arrayRemove = firestore.FieldValue.arrayRemove(
      JSON.stringify(serviceSession.service)
    );
    const arrayAdd = firestore.FieldValue.arrayUnion(
      JSON.stringify(new_service_obj)
    );

    await firestore()
      .collection("GYM")
      .doc(GYM_OWNER_EMAIL_ID)
      .collection("MEMBERS")
      .doc(data.id)
      .update({
        service: arrayRemove,
      })
      .then(() => {});
    await firestore()
      .collection("GYM")
      .doc(GYM_OWNER_EMAIL_ID)
      .collection("MEMBERS")
      .doc(data.id)
      .update({
        service: arrayAdd,
      })
      .then(() => {
        ToastAndroid.show("Updated successfully", ToastAndroid.SHORT);
      });

    const member = await firestore()
      .collection("GYM")
      .doc(GYM_OWNER_EMAIL_ID)
      .collection("MEMBERS")
      .doc(data.id)
      .get();

    // console.log(member);

    // console.log(planSession.plan);
    // console.log(new_plan_obj);
    setInitializing(false);
    setDueAmount("");
    setAmount("");
    setServiceSession();
    hideModalPlanForm();
    navigation.replace("MemberDetails", { data: member._data });
  };

  if (initializing) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const whatsappFun = (phone_no, name) => {
    Linking.openURL(
      "whatsapp://send?text=Hello " +
        name +
        ", this message is to to inform you about&phone=" +
        phone_no
    );
  };

  const phoneFun = (phone_no) => {
    Linking.openURL(`tel:${phone_no}`);
  };

  return (
    <View style={{ backgroundColor: "#2f50c9", height: "100%" }}>
      <Provider>
        <ScrollView>
          <View style={styles.MainContainer}>
            <View style={styles.UpperContainer}>
              <View style={styles.ImageName}>
                <View style={styles.MemberImage}>
                  <Image
                    style={styles.avatar}
                    source={{ uri: data.profileImg }}
                  />
                </View>
                <View style={styles.MemberInfo}>
                  <Text numberOfLines={1} style={styles.MemberName}>
                    {data.name}
                  </Text>
                  <Text style={styles.MemberContact}>{data.phone_no}</Text>
                  <Text numberOfLines={1} style={styles.MemberContact}>
                    {data.email_id}
                  </Text>
                </View>
              </View>

              <View style={styles.UpperRightContainer}>
                <View style={styles.Details}>
                  <Text style={styles.Label}>Injury/Body pain: </Text>
                  <Text numberOfLines={1} style={styles.Discription}>
                    {data.injury}
                  </Text>
                </View>
                <View style={styles.Details}>
                  <Text style={styles.Label}>Gender: </Text>
                  <Text style={styles.Discription}>{data.gender}</Text>
                </View>
                <View style={styles.Details}>
                  <Text style={styles.Label}>Address: </Text>
                  <Text numberOfLines={1} style={styles.Discription}>
                    {data.address}
                  </Text>
                </View>
                <View style={styles.Details}>
                  <Text style={styles.Label}>DOB: </Text>
                  <Text style={styles.Discription}>{dob}</Text>
                </View>
                <View style={styles.QuickAction}>
                  <TouchableOpacity
                    onPress={() => {
                      whatsappFun(data.phone_no, data.name);
                    }}
                  >
                    <View style={styles.quicktab}>
                      <FontAwesome5
                        name="whatsapp"
                        size={22}
                        color={"#2f50c9"}
                      />
                      <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                        Whatsapp
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      phoneFun(data.phone_no);
                    }}
                  >
                    <View style={styles.quicktab}>
                      <FontAwesome5 name="phone" size={22} color={"#2f50c9"} />
                      <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                        Phone
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={styles.quicktab}>
                      <FontAwesome5 name="marker" size={22} color={"#2f50c9"} />
                      <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                        Attendance
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => banfun()}>
                    {data.block == true ? (
                      <View style={styles.quicktab}>
                        <FontAwesome5 name="ban" size={22} color={"red"} />
                        <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                          Banned
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.quicktab}>
                        <FontAwesome5 name="ban" size={22} color={"#2f50c9"} />
                        <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                          Ban
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.MiddleContainer}>
              <Text style={styles.MiddleTitle}>Plans and Services</Text>

              <View style={styles.TabContainer}>
                <View style={styles.Tabs}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setChoice("1")}
                    style={{
                      backgroundColor: choice == "1" ? "#6F84FD" : "#fff",
                      borderRadius: 20,
                      width: 150,
                    }}
                  >
                    <Text
                      style={{
                        color: choice == "1" ? "#fff" : "#000",
                        fontSize: 18,
                        textAlign: "center",
                        padding: 5,
                        fontWeight: choice == "1" ? "bold" : "100",
                      }}
                    >
                      Plans
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setChoice("2")}
                    style={{
                      backgroundColor: choice == "2" ? "#6F84FD" : "#fff",
                      borderRadius: 20,
                      width: 150,
                    }}
                  >
                    <Text
                      style={{
                        color: choice == "2" ? "#fff" : "#000",
                        fontSize: 18,
                        textAlign: "center",
                        padding: 5,
                        fontWeight: choice == "2" ? "bold" : "100",
                      }}
                    >
                      Services
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {choice == "1" ? (
                <View style={styles.Holder}>
                  <View style={styles.cards}>
                    {data.plans.map((item, index) => {
                      var plan = JSON.parse(item);
                      return (
                        <View style={styles.card} key={index}>
                          <View style={styles.AboutPlan}>
                            <Text style={styles.PlanName}>
                              Plan: {plan.plan} Plan
                            </Text>
                            <Text style={styles.PlanAmount}>
                              Price: {plan.amount}
                            </Text>
                          </View>
                          <View style={styles.datesAndPayment}>
                            <View style={styles.PlansInfo}>
                              <Text style={styles.PurchaseDate}>
                                Purchase Date:{" "}
                                {new Date(plan.date).getDate() +
                                  "/" +
                                  (new Date(plan.date).getMonth() + 1) +
                                  "/" +
                                  new Date(plan.date).getFullYear()}
                              </Text>
                              <Text style={styles.ExpiryDate}>
                                Expiry Date: {getPlanExpiry(plan)}
                              </Text>
                            </View>
                            <View style={styles.AddPaymentBtn}>
                              <TouchableOpacity
                                style={styles.AddPayment}
                                onPress={() =>
                                  processPaymentForPlan(index, plan)
                                }
                              >
                                <Text style={styles.AddPaymentText}>
                                  Add Payment
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View style={styles.CostInfo}>
                            <Text style={styles.PaidAmt}>
                              Paid:{" "}
                              {
                                <Text style={{ color: "#90EE90" }}>
                                  {plan.amountPaid}
                                </Text>
                              }
                            </Text>
                            <Text style={styles.Discount}>
                              Discount:{" "}
                              {
                                <Text style={{ color: "#fff" }}>
                                  {plan.discount}
                                </Text>
                              }
                            </Text>
                            <Text style={styles.DueAmt}>
                              Due:{" "}
                              {
                                <Text style={{ color: "red" }}>
                                  {plan.amount -
                                    plan.discount -
                                    plan.amountPaid}
                                </Text>
                              }
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ) : (
                <View style={styles.Holder}>
                  <View style={styles.cards}>
                    {data.service.map((item, index) => {
                      var service = JSON.parse(item);
                      return (
                        <View style={styles.card} key={index}>
                          <View style={styles.AboutPlan}>
                            <Text style={styles.PlanName}>
                              Service: {service.service}
                            </Text>
                            <Text style={styles.PlanAmount}>
                              Price: {service.amount}
                            </Text>
                          </View>
                          <View style={styles.datesAndPayment}>
                            <View style={styles.PlansInfo}>
                              <Text style={styles.PurchaseDate}>
                                Purchase Date:{" "}
                                {new Date(service.date).getDate() +
                                  "/" +
                                  (new Date(service.date).getMonth() + 1) +
                                  "/" +
                                  new Date(service.date).getFullYear()}
                              </Text>
                            </View>
                            <View style={styles.AddPaymentBtn}>
                              <TouchableOpacity
                                style={[
                                  { marginBottom: 10 },
                                  styles.AddPayment,
                                ]}
                                onPress={() => {
                                  processPaymentForService(index, service);
                                }}
                              >
                                <Text style={styles.AddPaymentText}>
                                  Add Payment
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View style={styles.CostInfo}>
                            <Text style={styles.PaidAmt}>
                              Paid:{" "}
                              <Text style={{ color: "#90EE90" }}>
                                {service.amountPaid}
                              </Text>
                            </Text>
                            <Text style={styles.Discount}>
                              Discount:{" "}
                              {
                                <Text style={{ color: "#fff" }}>
                                  {service.discount}
                                </Text>
                              }
                            </Text>
                            <Text style={styles.DueAmt}>
                              Due:{" "}
                              {
                                <Text style={{ color: "red" }}>
                                  {service.amount -
                                    service.discount -
                                    service.amountPaid}
                                </Text>
                              }
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
            <Portal>
              <Modal
                visible={visiblePlanForm}
                onDismiss={hideModalPlanForm}
                contentContainerStyle={containerStyle}
              >
                <Text style={styles.formLabel}>Enter amount</Text>
                <Text>Due : {dueAmount}</Text>
                <TextInput
                  style={styles.inputField}
                  label="Amount"
                  keyboardType="numeric"
                  numberOfLines={1}
                  value={amount}
                  onChangeText={(text) => setAmount(text)}
                  left={<TextInput.Icon name="cash" />}
                />
                <TouchableOpacity
                  style={[
                    styles.formButton,
                    dueAmount > 0
                      ? { backgroundColor: "#2f50c9" }
                      : { backgroundColor: "#ddd" },
                  ]}
                  onPress={() => {
                    if (dueAmount > 0) updatePlanInDB();
                  }}
                >
                  <Text style={styles.formBtnText}>Add payment</Text>
                </TouchableOpacity>
              </Modal>
            </Portal>
            <Portal>
              <Modal
                visible={visibleServiceForm}
                onDismiss={hideModalServieForm}
                contentContainerStyle={containerStyle}
              >
                <Text style={styles.formLabel}>Enter amount</Text>
                <Text>Due : {dueAmount}</Text>
                <TextInput
                  style={styles.inputField}
                  label="Amount"
                  keyboardType="numeric"
                  numberOfLines={1}
                  value={amount}
                  onChangeText={(text) => setAmount(text)}
                  left={<TextInput.Icon name="cash" />}
                />
                <TouchableOpacity
                  style={[
                    styles.formButton,
                    dueAmount > 0
                      ? { backgroundColor: "#2f50c9" }
                      : { backgroundColor: "#ddd" },
                  ]}
                  onPress={() => {
                    if (dueAmount > 0) updateServiceInDB();
                  }}
                >
                  <Text style={styles.formBtnText}>Add payment</Text>
                </TouchableOpacity>
              </Modal>
            </Portal>
            <View style={styles.LowerContainer}></View>
          </View>
        </ScrollView>
      </Provider>
      <FloatingAction
        actions={actions}
        color={"#000"}
        onPressItem={(name) => {
          {
            name == "AddPlan"
              ? navigation.navigate("AddPlanToMember", { id: data.id })
              : navigation.navigate("AddServiceToMember", { id: data.id });
          }
        }}
      />
    </View>
  );
};

export default MemberDetails;

const containerStyle = { backgroundColor: "white", padding: 20, margin: 20 };

const styles = StyleSheet.create({
  MainContainer: {
    height: "100%",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  UpperContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 20,
  },
  ImageName: {
    overflow: "hidden",
  },
  MemberImage: {},
  avatar: {
    width: 130,
    height: 150,
    borderRadius: 20,
    resizeMode: "stretch",
  },
  MemberInfo: {
    marginTop: 10,
    width: 130,
  },
  MemberName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2f50c9",
  },
  MemberContact: {
    fontSize: 14,
    opacity: 0.7,
  },
  UpperRightContainer: {
    display: "flex",
    flexDirection: "column",
    paddingRight: 20,
  },

  Details: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 10,
    marginBottom: 5,
  },
  QuickAction: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 10,
    marginTop: 10,
    justifyContent: "space-between",
  },
  quicktab: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  Label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#2f50c9",
  },
  Discription: {
    fontSize: 14,
    fontWeight: "bold",
    width: 80,
  },
  MiddleContainer: {},
  MiddleTitle: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    marginLeft: 20,
  },
  TabContainer: {
    padding: 20,
  },
  Tabs: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Holder: {
    backgroundColor: "#2f50c9",
    width: width,
    borderTopRightRadius: 50,
    paddingBottom: 20,
  },
  cards: {},
  card: {
    marginTop: 20,
    // height: 130,
    width: width - 20,
    overflow: "hidden",
    backgroundColor: "#6F84FD",
    paddingLeft: 20,
    paddingRight: 50,
    paddingTop: 10,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    elevation: 5,
  },
  AboutPlan: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  PlanName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  PlanAmount: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  PlansInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  PurchaseDate: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  ExpiryDate: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  datesAndPayment: {
    display: "flex",
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
  },
  AddPaymentBtn: {},
  AddPayment: {
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 10,
    borderColor: "white",
    borderRadius: 5,
    backgroundColor: "#6F84FD",
    elevation: 5,
  },
  AddPaymentText: {
    textAlign: "right",
    fontSize: 12,
    color: "#90EE90",
    fontWeight: "bold",
  },
  CostInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  PaidAmt: {
    color: "white",
    fontWeight: "bold",
  },
  Discount: {
    color: "white",
    fontWeight: "bold",
  },
  DueAmt: {
    color: "white",
    fontWeight: "bold",
  },
  LowerContainer: {},
  inputField: {
    marginVertical: 10,
    height: 60,
  },
  formLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  formButton: {
    padding: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginVertical: 15,
  },
  formBtnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
