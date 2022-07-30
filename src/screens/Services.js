import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import React, { useState, useEffect } from "react";

import { FAB } from "react-native-paper";
import MemberCard from "../components/MemberCard";
import ServiceCard from "../components/ServiceCard";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const data = [
  {
    id: 1,
    name: "timepass",
    amount: "200",
  },
  {
    id: 2,
    name: "cardio",
    amount: "400",
  },
];

const Services = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState("");
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    try {
      const value = await AsyncStorage.getItem("GYM");

      const serviceList = [];
      await firestore()
        .collection("GYM")
        .doc(value)
        .collection("SERVICES")
        .get()
        .then((result) => {
          result.forEach((doc) => {
            const { service, amount } = doc.data();
            serviceList.push({
              service,
              amount,
            });
          });
        });
      setServices(serviceList);
      setInitializing(false);
    } catch (error) {
      console.log("eee" + error);
    }
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
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      styles={styles.container}
    >
      <View style={styles.body}>
        {services.map((item, index) => {
          return <ServiceCard key={index} data={item} />;
        })}
        <FAB
          color={"#fff"}
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate("AddService")}
        />
      </View>
    </ScrollView>
  );
};

export default Services;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  body: {
    height: "100%",
    padding: 20,
    backgroundColor: "#fff",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 20,
    bottom: 30,
    backgroundColor: "#2f50c9",
  },
});
