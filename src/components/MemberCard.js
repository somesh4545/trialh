import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

import Entypo from "react-native-vector-icons/Entypo";
import Fontisto from "react-native-vector-icons/Fontisto";
import { Menu, Button, Divider, Provider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const data = [];

const MemberCard = (props) => {
  const navigation = useNavigation();

  const [visible, setVisible] = useState(true);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const {
    id,
    email_id,
    gender,
    phone_no,
    joining_date,
    plans,
    service,
    name,
    injury,
    address,
    dob,
    block,
  } = props.data;

  // const plans_data = JSON.parse(plans);

  var plan_expiry = "";
  if (plans.length != 0) {
    var latest_plan = JSON.parse(plans[plans.length - 1]);
    var plan_start = latest_plan.date;
    var duration = parseInt(latest_plan.duration);
    plan_start = new Date(plan_start);

    if (latest_plan.durationType == "Month") {
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
      plan_expiry.getMonth() +
      "/" +
      plan_expiry.getFullYear();
  }

  var dueAmount = 0;
  if (plans.length != 0) {
    plans.map((item) => {
      var plan = JSON.parse(item);
      dueAmount +=
        parseInt(plan.amount) -
        parseInt(plan.discount) -
        parseInt(plan.amountPaid);
    });
  }

  if (service.length != 0) {
    service.map((item) => {
      var ser = JSON.parse(item);
      dueAmount +=
        parseInt(ser.amount) -
        parseInt(ser.discount) -
        parseInt(ser.amountPaid);
    });
  }

  // console.log(props.data.profileImg);

  return (
    <View>
      {/* <Provider style={{padding: 0, margin: 0}}> */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          navigation.navigate("MemberDetails", { data: props.data });
        }}
      >
        <View style={styles.memberCard}>
          <View style={styles.memberCardLeft}>
            <View style={styles.memberAvatar}>
              <Image
                source={{ uri: props.data.profileImg }}
                style={styles.profileImg}
              />
              {/* <Fontisto name={props.data.gender} size={25} color="#2f70c9" /> */}
            </View>
          </View>
          <View style={styles.memberCardRight}>
            <Text style={styles.memberText} numberOfLines={1}>
              <Text style={styles.memberTextBold}>Name: </Text> {name}
            </Text>
            <Text style={styles.memberText} numberOfLines={1}>
              <Text style={styles.memberTextBold}>Plan: </Text>{" "}
              {plans.length != 0
                ? JSON.parse(plans[plans.length - 1]).plan
                : "no plan"}
            </Text>
            <Text style={styles.memberText} numberOfLines={1}>
              <Text style={styles.memberTextBold}>Plan expiry: </Text>
              {plan_expiry.toString()}
            </Text>
            <Text style={styles.memberText} numberOfLines={1}>
              <Text style={styles.memberTextBold}>Due amount: </Text>
              {dueAmount}
            </Text>
          </View>
          {/* <View style={{ flex: 1, zIndex: 200 }}>
          <Menu
            style={{ flex: 1, zIndex: 200 }}
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity
                onPress={openMenu}
                style={{ widht: 1, backgroundColor: "#fff" }}
              >
                <Entypo name="dots-three-vertical" size={18} color="#000" />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() => {
                closeMenu();
              }}
              title="ID card"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
              }}
              title="Attendance"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
              }}
              title="Renew plan"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
              }}
              title="Call"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
              }}
              title="Whatsapp"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
              }}
              title="Block"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
              }}
              title="Delete"
            />
          </Menu>
        </View> */}
        </View>
      </TouchableOpacity>
      {/* </Provider> */}
    </View>
  );
};

export default MemberCard;

const styles = StyleSheet.create({
  memberCard: {
    display: "flex",
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 5,
  },
  memberCardLeft: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  memberAvatar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    width: 70,
    borderRadius: 70,
  },
  profileImg: {
    height: 70,
    width: 70,
    borderRadius: 70,
  },
  memberText: {
    fontSize: 17,
    paddingBottom: 2,
  },
  memberTextBold: {
    marginRight: 10,
    fontWeight: "bold",
  },
});
