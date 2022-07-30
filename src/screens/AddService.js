import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import React, { useState, useEffect } from "react";

import { TextInput, RadioButton } from "react-native-paper";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddService = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [amount, setAmount] = useState();

  useEffect(() => {}, []);

  const AddServiceToDb = async () => {
    if (serviceName.length == 0 && amount.length == 0) {
      ToastAndroid.show("All fields required", ToastAndroid.SHORT);
    } else {
      const value = await AsyncStorage.getItem("GYM");

      await firestore()
        .collection("GYM")
        .doc(value)
        .collection("SERVICES")
        .doc(serviceName)
        .set({
          service: serviceName,
          amount: amount,
        })
        .then(() => {
          ToastAndroid.show("Service added successfully !", ToastAndroid.SHORT);

          const increment = firestore.FieldValue.increment(1);
          firestore().collection("GYM").doc(value).update({
            services: increment,
          });

          navigation.replace("Services");
        });
    }
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.formHeader}>
          <TextInput
            style={styles.inputField}
            label="Service name"
            numberOfLines={1}
            value={serviceName}
            onChangeText={(text) => setServiceName(text)}
            left={<TextInput.Icon name="format-list-bulleted-type" />}
          />
          <TextInput
            style={styles.inputField}
            label="Amount"
            keyboardType="numeric"
            numberOfLines={1}
            value={amount}
            onChangeText={(text) => setAmount(text)}
            left={<TextInput.Icon name="cash" />}
          />
        </View>
        <View style={styles.formBottom}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => AddServiceToDb()}
          >
            <Text style={styles.buttonText}>Add service</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddService;

const styles = StyleSheet.create({
  container: {
    // height: "100%",
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "space-between",
    // alignItems: 'center',
  },
  inputField: {
    marginVertical: 10,
  },
  formBottom: {
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
});