import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";

import { Divider } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0, // optional, defaults to 2dp
  color: () => "#000",
  labelColor: () => "#000",
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "2",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
};

const Collections = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [planCollection, setPlanCollection] = useState();
  const [serviceCollection, setServiceCollection] = useState();
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // fetching members
    const value = await AsyncStorage.getItem("GYM");

    const members = await firestore()
      .collection("GYM")
      .doc(value)
      .collection("MEMBERS")
      .get();

    // console.log(members.docs);
    const membersArray = members.docs;

    var discount = 0;

    var plan_full = 0;
    var plan_full_total = 0;
    var plan_full_members = [];

    var plan_reminder = 0;
    var plan_reminder_total = 0;
    var plan_reminder_received = 0;
    var plan_reminder_remaining = 0;
    var plan_reminder_members = [];

    var plan_unpaid = 0;
    var plan_unpaid_total = 0;
    var plan_unpaid_members = [];

    var p = 0;
    membersArray.map((member) => {
      member._data.plans.map((plan_details) => {
        plan_details = JSON.parse(plan_details);
        p++;

        plan_details.amount = parseInt(plan_details.amount);
        plan_details.amountPaid = parseInt(plan_details.amountPaid);
        plan_details.discount = parseInt(plan_details.discount);

        discount += plan_details.discount;
        // console.log("plan_details: " + JSON.stringify(plan_details));
        // checking if plan is completly paid
        if (
          plan_details.amount == plan_details.amountPaid ||
          plan_details.amount == plan_details.amountPaid + plan_details.discount
        ) {
          plan_full += 1;
          plan_full_total += plan_details.amount;
          if (plan_full_members.includes(member._data) == false)
            plan_full_members.push(member._data);
        } else if (
          plan_details.amountPaid == 0 &&
          plan_details.amount != 0 &&
          plan_details.discount != plan_details.amount
        ) {
          plan_unpaid += 1;
          plan_unpaid_total += plan_details.amount;
          if (plan_unpaid_members.includes(member._data) == false)
            plan_unpaid_members.push(member._data);
        } else {
          plan_reminder += 1;
          plan_reminder_total += plan_details.amount - plan_details.discount;
          plan_reminder_received += plan_details.amountPaid;
          plan_reminder_remaining +=
            plan_details.amount -
            plan_details.amountPaid -
            plan_details.discount;
          if (plan_reminder_members.includes(member._data) == false)
            plan_reminder_members.push(member._data);
        }
      });
    });

    var resultPlan = {
      totalPlans: p,
      total: plan_full_total + plan_reminder_total + plan_unpaid_total,
      received: plan_full_total + plan_reminder_received,
      remaining: plan_reminder_remaining + plan_unpaid_total,
      plan_full,
      plan_full_total,
      plan_reminder,
      plan_reminder_total,
      plan_reminder_received,
      plan_reminder_remaining,
      plan_unpaid,
      plan_unpaid_total,
      plan_full_members,
      plan_reminder_members,
      plan_unpaid_members,
    };
    setPlanCollection(resultPlan);

    // calculating services collection
    var service_full = 0;
    var service_full_total = 0;
    var service_full_members = [];

    var service_reminder = 0;
    var service_reminder_total = 0;
    var service_reminder_received = 0;
    var service_reminder_remaining = 0;
    var service_reminder_members = [];

    var service_unpaid = 0;
    var service_unpaid_total = 0;
    var service_unpaid_members = [];

    var s = 0;

    membersArray.map((member) => {
      member._data.service.map((service_details) => {
        // checking if plan is completly paid
        service_details = JSON.parse(service_details);
        s++;
        // console.log("service_details " + JSON.stringify(service_details));

        service_details.amount = parseInt(service_details.amount);
        service_details.amountPaid = parseInt(service_details.amountPaid);
        service_details.discount = parseInt(service_details.discount);

        discount += service_details.discount;

        if (service_details.amount == service_details.amountPaid) {
          service_full += 1;
          service_full_total += service_details.amount;
          if (service_full_members.includes(member._data) == false)
            service_full_members.push(member._data);
        } else if (
          service_details.amountPaid == 0 &&
          service_details.amount != 0 &&
          service_details.discount != service_details.amount
        ) {
          service_unpaid += 1;
          service_unpaid_total +=
            service_details.amount - service_details.discount;
          if (service_unpaid_members.includes(member._data) == false)
            service_unpaid_members.push(member._data);
        } else {
          service_reminder += 1;
          service_reminder_total +=
            service_details.amount - service_details.discount;
          service_reminder_received += service_details.amountPaid;
          service_reminder_remaining +=
            service_details.amount -
            service_details.amountPaid -
            service_details.discount;
          if (service_reminder_members.includes(member._data) == false)
            service_reminder_members.push(member._data);
        }
      });
    });

    var resultService = {
      totalServices: s,
      total: service_full_total + service_reminder_total + service_unpaid_total,
      received: service_full_total + service_reminder_received,
      remaining: service_reminder_remaining + service_unpaid_total,
      service_full,
      service_full_total,
      service_reminder,
      service_reminder_total,
      service_reminder_received,
      service_reminder_remaining,
      service_unpaid,
      service_unpaid_total,
      service_full_members,
      service_reminder_members,
      service_unpaid_members,
    };
    setServiceCollection(resultService);

    // pie_chart_data.data = [
    //   {
    //     name: "Received",
    //     amount: resultPlan.received + resultService.received,
    //     color: "#00FF00",
    //     legendFontColor: "#7F7F7F",
    //     legendFontSize: 15,
    //   },
    //   {
    //     name: "Remaining",
    //     amount: resultPlan.remaining + resultService.remaining,
    //     color: "#F00",
    //     legendFontColor: "#7F7F7F",
    //     legendFontSize: 15,
    //   },
    //   {
    //     name: "Discount",
    //     amount: discount,
    //     color: "#007ED6",
    //     legendFontColor: "#7F7F7F",
    //     legendFontSize: 15,
    //   },
    // ];

    setPieChartData([
      {
        name: "Received",
        amount: resultPlan.received + resultService.received,
        color: "#00FF00",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      },
      {
        name: "Remaining",
        amount: resultPlan.remaining + resultService.remaining,
        color: "#F00",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      },
      {
        name: "Discount",
        amount: discount,
        color: "#007ED6",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      },
    ]);
    setInitializing(false);
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
        {/* date block */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Collection</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Overall collection</Text>
            <View style={styles.blockDivider} />
            {pieChartData.length != 0 ? (
              <PieChart
                data={pieChartData}
                width={Dimensions.get("window").width - 40}
                height={220}
                chartConfig={chartConfig}
                accessor={"amount"}
                backgroundColor={"transparent"}
                paddingLeft={"0"}
                center={[0, 0]}
                absolute
              />
            ) : null}
          </View>

          {/* member plan collection block */}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Members's plan collection</Text>
            <View style={styles.blockDivider} />
            <TouchableOpacity onPress={() => navigation.navigate("Members")}>
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Total plans: {planCollection.totalPlans}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Total amount:{" "}
                  {planCollection != null ? planCollection.total : null}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Received:{" "}
                  {planCollection != null ? planCollection.received : null}
                </Text>
                <Text style={styles.boldText}>
                  Remaining:{" "}
                  {planCollection != null ? planCollection.remaining : null}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.blockDivider} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Members", {
                  membersData: planCollection.plan_full_members,
                })
              }
            >
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Full paid:{" "}
                  {planCollection != null ? planCollection.plan_full : null}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Total amount:{" "}
                  {planCollection != null
                    ? planCollection.plan_full_total
                    : null}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.blockDivider} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Members", {
                  membersData: planCollection.plan_reminder_members,
                })
              }
            >
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Remainder balance:{" "}
                  {planCollection != null ? planCollection.plan_reminder : null}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Total amount:{" "}
                  {planCollection != null
                    ? planCollection.plan_reminder_total
                    : null}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Received:{" "}
                  {planCollection != null
                    ? planCollection.plan_reminder_received
                    : null}
                </Text>
                <Text style={styles.boldText}>
                  Remaining:{" "}
                  {planCollection != null
                    ? planCollection.plan_reminder_remaining
                    : null}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.blockDivider} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Members", {
                  membersData: planCollection.plan_unpaid_members,
                })
              }
            >
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Unpaid payment:{" "}
                  {planCollection != null ? planCollection.plan_unpaid : null}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Total amount:{" "}
                  {planCollection != null
                    ? planCollection.plan_unpaid_total
                    : null}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* member service collection */}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Members's service collection</Text>
            <View style={styles.blockDivider} />
            <TouchableOpacity onPress={() => navigation.navigate("Members")}>
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Total services: {serviceCollection.totalServices}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Total amount:{" "}
                  {serviceCollection != null ? serviceCollection.total : null}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Received:{" "}
                  {serviceCollection != null
                    ? serviceCollection.received
                    : null}
                </Text>
                <Text style={styles.boldText}>
                  Remaining:{" "}
                  {serviceCollection != null
                    ? serviceCollection.remaining
                    : null}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.blockDivider} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Members", {
                  membersData: serviceCollection.service_full_members,
                })
              }
            >
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Full paid:{" "}
                  {serviceCollection != null
                    ? serviceCollection.service_full
                    : null}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Total amount:{" "}
                  {serviceCollection != null
                    ? serviceCollection.service_full_total
                    : null}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.blockDivider} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Members", {
                  membersData: serviceCollection.service_reminder_members,
                })
              }
            >
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Remainder balance:{" "}
                  {serviceCollection != null
                    ? serviceCollection.service_reminder
                    : null}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Total amount:{" "}
                  {serviceCollection != null
                    ? serviceCollection.service_reminder_total
                    : null}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Received:{" "}
                  {serviceCollection != null
                    ? serviceCollection.service_reminder_received
                    : null}
                </Text>
                <Text style={styles.boldText}>
                  Remaining:{" "}
                  {serviceCollection != null
                    ? serviceCollection.service_reminder_remaining
                    : null}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.blockDivider} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Members", {
                  membersData: serviceCollection.service_unpaid_members,
                })
              }
            >
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Unpaid payment:{" "}
                  {serviceCollection != null
                    ? serviceCollection.service_unpaid
                    : null}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.boldText}>
                  Total amount:{" "}
                  {serviceCollection != null
                    ? serviceCollection.service_unpaid_total
                    : null}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 80 }}></View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Collections;

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
    height: "100%",
    marginTop: -30,
    overflow: "hidden",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: "#fff",
    padding: 20,
  },
  block: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 5,
    overflow: "hidden",
  },
  blockTitle: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
  },
  blockDivider: {
    marginVertical: 5,
    width: "100%",
    height: 1,
    backgroundColor: "#d3d3d3",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 5,
  },
  boldText: {
    fontSize: 16,
    marginRight: 10,
  },
});
