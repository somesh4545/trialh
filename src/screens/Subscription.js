import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  RadioButton,
  Modal,
  Provider,
  Portal,
  Divider,
} from "react-native-paper";
import firestore from "@react-native-firebase/firestore";

const { width, height } = Dimensions.get("window");

const Subscription = () => {
  const [plan, setPlan] = useState();
  const [price, setPrice] = useState("0");
  const [subs, setSubs] = useState([]);
  const [initializing, setInitializing] = useState(true);

  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    const getSubs = async () => {
      const subsList = [];
      await firestore()
        .collection("SUBSCRIPTIONS")
        .get()
        .then((result) => {
          result.forEach((doc) => {
            const {
              desc,
              discounted_price,
              name,
              org_price,
              id,
              payment_link,
            } = doc.data();
            subsList.push({
              desc,
              discounted_price,
              name,
              org_price,
              id,
              payment_link,
            });
          });
        });
      setPlan(subsList[0]);
      setPrice(subsList[0].discounted_price);
      setSubs(subsList);
      setInitializing(false);
    };

    getSubs();
  }, []);

  const Payment = () => {
    showModal();
    if (plan == null) {
      ToastAndroid.show("Select a plan", ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(
        "Proccessing a payment for " + plan.name + "plan",
        ToastAndroid.SHORT
      );
    }
  };

  const containerStyle = { backgroundColor: "white", padding: 20, margin: 20 };

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
    <ScrollView>
      <View style={styles.mainContainer}>
        <Provider>
          <View style={styles.headingContainer}>
            <Text style={styles.TitleText}>Be the part of huge community!</Text>
            <Text style={styles.SubtitleText}>
              Various plans with various features.
            </Text>
          </View>

          <View style={styles.MiddleContainer}>
            <View style={styles.cardsContainer}>
              {subs.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.9}
                    onPress={() => {
                      setPlan(item), setPrice(item.discounted_price);
                    }}
                    style={[
                      styles.Card,
                      {
                        borderWidth: plan.id == item.id ? 4 : 0,
                        borderColor: plan.id == item.id ? "green" : "grey",
                        elevation: plan.id == item.id ? 5 : 2,
                      },
                    ]}
                  >
                    <Card>
                      <View style={styles.cardHeader}>
                        <View style={styles.cardHeaderPriceSection}>
                          <Text style={styles.discountedPrice}>
                            Rs. {item.discounted_price}
                          </Text>
                          <Text style={styles.orgPrice}>
                            Rs. {item.org_price}
                          </Text>
                        </View>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                      </View>

                      <Card.Content>
                        <View style={styles.features}>
                          {item.desc.map((item1, index) => {
                            return (
                              <Text
                                key={index}
                                numberOfLines={1}
                                style={{ width: "50%", marginBottom: 5 }}
                              >
                                {"✔️" + " "}
                                {item1}
                              </Text>
                            );
                          })}
                        </View>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.footerContainer}>
            <Button
              style={styles.PurchaseButton}
              mode="contained"
              onPress={() => Payment()}
            >
              Checkout Plan
            </Button>

            <Text style={styles.total}>Total Rs. {price}</Text>
          </View>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={containerStyle}
            >
              <Text style={styles.textBold}>Plan: {plan.name}</Text>
              <Text style={styles.textBold}>
                Amount: {plan.discounted_price}
              </Text>
              <View style={{ marginBottom: 10 }} />
              <Text style={styles.text}>Follow the below steps</Text>
              <Text style={styles.text}>
                {"\u2022"} Pay the amount using this link : {plan.payment_link}
              </Text>
              <Text style={styles.text}>
                {"\u2022"} After payment send the screenshot of the transcation
                to this number
              </Text>
              <Text style={styles.text}>
                {"\u2022"} Your plan would be started immediately after
                verfication
              </Text>
            </Modal>
          </Portal>
        </Provider>
      </View>
    </ScrollView>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
    backgroundColor: "#fff",
    height: "100%",
  },
  headingContainer: {},
  TitleText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  cardHeader: {
    padding: 20,
  },
  cardHeaderPriceSection: {
    display: "flex",
    flexDirection: "row",
  },
  orgPrice: {
    fontSize: 20,
    color: "black",
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    marginLeft: 10,
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  cardTitle: {},
  SubtitleText: {
    fontSize: 15,
    marginTop: 5,
  },
  MiddleContainer: {},
  cardsContainer: {},
  Card: {
    marginTop: 20,
    // elevation: 5,
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: "grey",
  },
  features: {
    // flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  footerContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 10,
  },
  PurchaseButton: {
    backgroundColor: "#2f50c9",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2f50c9",
  },

  textBold: {
    fontSize: 17,
    fontWeight: "bold",
  },
  text: {
    fontSize: 15,
    paddingVertical: 2,
  },
});
