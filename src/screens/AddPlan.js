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
import { Dropdown } from "react-native-element-dropdown";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const data = [
  { label: "1 month", value: "1" },
  { label: "2 month", value: "2" },
  { label: "3 month", value: "3" },
  { label: "4 month", value: "4" },
  { label: "5 month", value: "5" },
  { label: "6 month", value: "6" },
  { label: "7 month", value: "7" },
  { label: "8 month", value: "8" },
  { label: "11 month", value: "11" },
  { label: "12 month", value: "12" },
  { label: "13 month", value: "13" },
  { label: "14 month", value: "14" },
  { label: "15 month", value: "15" },
  { label: "16 month", value: "16" },
  { label: "17 month", value: "17" },
  { label: "18 month", value: "18" },
];

const AddPlan = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState("");
  const [planName, setPlanName] = useState("");
  const [amount, setAmount] = useState("");
  const [durationType, setDurationType] = useState("Month");
  const [days, setDays] = useState("");
  const [months, setMonths] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [plancount, setPlancount] = useState();

  useEffect(() => {}, []);

  const AddPlanToDb = async () => {
    const value = await AsyncStorage.getItem("GYM");

    if (durationType == "Month" && months.length == 0) {
      ToastAndroid.show(
        "Select number of months",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      // console.log("Select number of months");
    } else if (durationType == "Days" && days.length == 0) {
      // console.log("Enter number of days");
      ToastAndroid.show(
        "Enter number of days",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else if (planName.length == 0 && amount.length == 0) {
      // console.log("All fields are required");
      ToastAndroid.show(
        "All fields required",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      var duration;
      if (durationType == "Month") {
        duration = months;
      } else {
        duration = days;
      }

      const increment = firestore.FieldValue.increment(1);

      await firestore()
        .collection("GYM")
        .doc(value)
        .collection("PLANS")
        .doc(planName)
        .set({
          plan: planName,
          amount: amount,
          durationType: durationType,
          duration: duration,
          // days: days,
          date: new Date(),
        })
        .then(() => {
          ToastAndroid.show("Plan added successfully !", ToastAndroid.SHORT);

          firestore().collection("GYM").doc(value).update({
            plans: increment,
          });

          setPlanName("");
          setAmount("");
          setMonths();
          setDays();
          navigation.replace("Plans");
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.formHeader}>
          <TextInput
            style={styles.inputField}
            label="Plan name"
            numberOfLines={1}
            value={planName}
            onChangeText={(text) => setPlanName(text)}
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
          <Text style={{ fontSize: 18, fontWeight: "300", marginTop: 10 }}>
            Select duration type
          </Text>
          <RadioButton.Group
            style={{ display: "flex", flexDirection: "row" }}
            row={true}
            onValueChange={(newValue) => setDurationType(newValue)}
            value={durationType}
          >
            <RadioButton.Item label="Month" value="Month" />
            <RadioButton.Item label="Days" value="Days" />
          </RadioButton.Group>

          <Text style={{ fontSize: 18, fontWeight: "300", marginTop: 10 }}>
            Duration
          </Text>
          {durationType === "Month" ? (
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Select months" : "..."}
              searchPlaceholder="Search..."
              value={months}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setMonths(item.value);
                setIsFocus(false);
              }}
            />
          ) : (
            <TextInput
              style={styles.inputField}
              label="Days"
              keyboardType="numeric"
              numberOfLines={1}
              value={days}
              onChangeText={(text) => setDays(text)}
              left={<TextInput.Icon name="calendar-month-outline" />}
            />
          )}
        </View>
        <View style={styles.formBottom}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => AddPlanToDb()}
          >
            <Text style={styles.buttonText}>Add plan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddPlan;

const styles = StyleSheet.create({
  container: {
    height: "100%",
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

  dropdown: {
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
