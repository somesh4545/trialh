import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
    ActivityIndicator,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  
  import { TextInput, RadioButton } from "react-native-paper";
  import { Dropdown } from "react-native-element-dropdown";
  import auth from "@react-native-firebase/auth";
  import firestore from "@react-native-firebase/firestore";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  const AddServiceToMember = ({ route,navigation }) => {
    const { id } = route.params;
    const [initializing, setInitializing] = useState(true);
    const [selectedService, setSelectedService] = useState();
    const [Services, setServices] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
  
    const [amountPaid, setAmountPaid] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [dueAmount, setDueAmount] = useState();
  
    useEffect(() => {
      fetchServices();
    }, []);
  
    const fetchServices = async () => {
      if (Services.length == 0) {
        const value = await AsyncStorage.getItem("GYM");
  
        const Services_data = await firestore()
          .collection("GYM")
          .doc(value)
          .collection("SERVICES")
          .get();
        var i = 1;
        var list = [];
        Services_data._docs.map((Service) => {
          var data = Service._data;
          var obj = {
            id: i,
            name: data.service,
            value: data.service,
            label: data.service,
            amount: data.amount,
          };
          list.push(obj);
          i++;
        });
        setServices(list);
        setSelectedService(list[0]);
        setDueAmount(list[0].amount);
      }
      setInitializing(false);
    };
  
    const calculateDueAmountAfterAmount = (amountPaidNew) => {
      var amountPaidNewInt = parseInt(amountPaidNew);
      var discountInt = parseInt(discount);
      var dueAmountInt = parseInt(selectedService.amount);
  
      // console.log(dueAmountInt + " " + amountPaidNewInt + " " + discountInt);
      var amount = dueAmountInt - (amountPaidNewInt + discountInt);
      setDueAmount(amount + "");
      // console.log(dueAmountInt - (amountPaidNewInt + discountInt));
    };
  
    const calculateDueAmountAfterDiscount = (discountNew) => {
      var amountPaidNewInt = parseInt(amountPaid);
      var discountInt = parseInt(discountNew);
      var dueAmountInt = parseInt(selectedService.amount);
  
      // console.log(dueAmountInt + " " + amountPaidNewInt + " " + discountInt);
      var amount = dueAmountInt - (amountPaidNewInt + discountInt);
      setDueAmount(amount + "");
      // console.log(dueAmountInt - (amountPaidNewInt + discountInt));
    };
  
    const addService = async () => {
      const GYM_OWNER_EMAIL_ID = await AsyncStorage.getItem("GYM");
  
      var services_array_obj = {
        service: selectedService.name,
        amount: selectedService.amount,
        amountPaid: amountPaid,
        discount: discount,
        date: new Date(),
      };
  
      firestore()
        .collection("GYM")
        .doc(GYM_OWNER_EMAIL_ID)
        .collection("MEMBERS")
        .doc(id)
        .update({
          service: firestore.FieldValue.arrayUnion(
            JSON.stringify(services_array_obj)
          ),
        })
        .then(() => {
          ToastAndroid.show("Service added successfully !", ToastAndroid.SHORT);
          const increment = firestore.FieldValue.increment(1);
  
          firestore().collection("GYM").doc(GYM_OWNER_EMAIL_ID).update({
            services: increment,
          });
  
            navigation.replace("Members");
        });
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
  
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.formHeader}>
            {/* Service details block */}
            <View style={styles.block}>
              <Text style={styles.blockTitle}>Service details</Text>
              <View style={styles.row}>
                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={Services}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "Select months" : "..."}
                  searchPlaceholder="Search..."
                  value={selectedService.value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setSelectedService(item);
                    setDueAmount(item.amount - discount - amountPaid + "");
                    setIsFocus(false);
                  }}
                />
              </View>
              <View style={styles.row}>
                <Text>Service amount: {selectedService.amount}</Text>
              </View>
            </View>
            <View style={styles.block}>
              <Text style={styles.blockTitle}>Payment details</Text>
              <View style={styles.tableRow}>
                <Text style={styles.tableText}>Amount paid</Text>
                <TextInput
                  style={styles.tableInput}
                  value={amountPaid + ""}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setAmountPaid(text);
                    calculateDueAmountAfterAmount(text);
                  }}
                />
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableText}>Discount rs.</Text>
                <TextInput
                  style={styles.tableInput}
                  value={discount + ""}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setDiscount(text);
                    calculateDueAmountAfterDiscount(text);
                  }}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  height: 2,
                  backgroundColor: "#000",
                  marginTop: 10,
                }}
              ></View>
              <View style={styles.tableRow}>
                <Text style={styles.tableText}>Due amount</Text>
                <TextInput
                  style={styles.tableInput}
                  value={dueAmount}
                  disabled={true}
                  onChangeText={(text) => setDueAmount(text)}
                />
              </View>
            </View>
          </View>
          <View style={styles.formBottom}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                addService();
              }}
            >
              <Text style={styles.buttonText}>Add Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };
  
  export default AddServiceToMember;
  
  const styles = StyleSheet.create({
    container: {
      height: "100%",
      flex: 1,
      // padding: 20,
      // backgroundColor: "#fff",
      display: "flex",
      justifyContent: "space-between",
      // alignItems: 'center',
    },
    inputField: {
      marginVertical: 10,
    },
    block: {
      marginBottom: 20,
      padding: 20,
      backgroundColor: "#fff",
    },
    blockTitle: {
      fontSize: 20,
      fontWeight: "bold",
    },
  
    row: {
      display: "flex",
      marginVertical: 5,
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    },
    formBottom: {
      padding: 20,
      marginBottom: 20,
    },
    buttonContainer: {
      padding: 10,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#2f50c9",
      borderRadius: 15,
    },
    buttonText: {
      color: "#fff",
      fontSize: 20,
      fontWeight: "bold",
    },
  
    input: {
      height: 55,
      padding: 0,
      backgroundColor: "#fff",
      width: "100%",
    },
  
    tableRow: {
      display: "flex",
      marginVertical: 5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  
    tableInput: {
      height: 55,
      padding: 0,
      backgroundColor: "#fff",
      width: "50%",
    },
  
    tableText: {
      fontSize: 18,
      width: "50%",
    },
  
    dropdown: {
      width: "100%",
      marginTop: 10,
      height: 50,
      borderColor: "gray",
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: "absolute",
      backgroundColor: "white",
      left: 22,
      top: 8,
      zIndex: 999,
      color: "#000",
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });
  