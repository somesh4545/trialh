import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";

import Card from "../components/Card";
import CardWithImage from "../components/CardWithImage";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QuickAction = () => {
  const [initializing, setInitializing] = useState(true);
  const [nearTermExpriy, setNearTermExpriy] = useState([]);
  const [totalMemberList, setTotalMemberList] = useState([]);
  const [activeMemberList, setActiveMemberList] = useState([]);
  const [expiredMemberList, setExpiredMemberList] = useState([]);
  const [blockMemberList, setBlockMemberList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const value = await AsyncStorage.getItem("GYM");

    const membersList = [];
    await firestore()
      .collection("GYM")
      .doc(value)
      .collection("MEMBERS")
      .get()
      .then((result) => {
        result.forEach((doc) => {
          const {
            id,
            email_id,
            gender,
            phone_no,
            joining_date,
            plans,
            service,
            name,
          } = doc.data();
          membersList.push({
            id,
            email_id,
            gender,
            phone_no,
            joining_date,
            plans,
            service,
            name,
          });
        });
      });

    // console.log(membersList);

    var near_term_expriy_member = [];
    var active_member = [];
    var expired_member = [];
    var block_member = [];

    membersList.map((member) => {
      if (member.block == true) {
        block_member.push(member);
      } else {
        var plans = member.plans;
        var res = find_if_expired(plans);

        if (res == true) {
          expired_member.push(member);
        } else {
          var d = new Date();
          d = d.setDate(d.getDate() + 10);
          // console.log(res, new Date(d));
          if (res < d) {
            near_term_expriy_member.push(member);
          }
          active_member.push(member);
        }
      }
    });

    setNearTermExpriy(near_term_expriy_member);
    setTotalMemberList(membersList);
    setActiveMemberList(active_member);
    setExpiredMemberList(expired_member);
    setBlockMemberList(block_member);
    setInitializing(false);
  };

  const find_if_expired = (plans) => {
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
    }
    // console.log(plan_expiry);
    if (plan_expiry < new Date()) {
      return true;
    } else {
      return plan_expiry;
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
    <View styles={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quick Actions</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.row}>
            <Card
              width={"100%"}
              count={nearTermExpriy.length}
              membersData={nearTermExpriy}
              title={"Near term expiry"}
              intent={"Members"}
            />
          </View>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
            Members
          </Text>
          <View style={styles.row}>
            <Card
              width={"47%"}
              count={totalMemberList.length}
              membersData={totalMemberList}
              title={"Total"}
              intent={"Members"}
            />
            <Card
              width={"47%"}
              count={activeMemberList.length}
              membersData={activeMemberList}
              title={"Active"}
              intent={"Members"}
            />
          </View>
          <View style={styles.row}>
            <Card
              width={"47%"}
              count={expiredMemberList.length}
              membersData={expiredMemberList}
              title={"Expired"}
              intent={"Members"}
            />
            <Card
              width={"47%"}
              count={blockMemberList.length}
              membersData={blockMemberList}
              title={"Blocked"}
              intent={"Members"}
            />
          </View>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
            Add
          </Text>
          <View style={styles.row}>
            <CardWithImage
              width={"30%"}
              icon={"user"}
              title={"Members"}
              intent={"AddMember"}
            />
            <CardWithImage
              width={"30%"}
              icon={"profile"}
              title={"Plans"}
              intent={"AddPlan"}
            />
            <CardWithImage
              width={"30%"}
              icon={"carryout"}
              title={"Services"}
              intent={"AddService"}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default QuickAction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2f50c9",
  },
  header: {
    backgroundColor: "#2f50c9",
    // backgroundColor: '#04080F',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 60,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "600",
  },
  body: {
    flex: 1,
    height: "100%",
    padding: 20,
    marginTop: -30,
    overflow: "hidden",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: "#fff",
    marginBottom: 80,
  },
  row: {
    flexDirection: "row",
    marginVertical: 15,
    justifyContent: "space-between",
  },
});
