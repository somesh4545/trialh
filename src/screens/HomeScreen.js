import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import Card from "../components/Card";

import { LineChart } from "react-native-chart-kit";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const HomeScreen = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState({ email: "official.sasp@gmail.com" });
  const [totalServices, setTotalServices] = useState();
  const [totalPlans, setTotalPlans] = useState();
  const [totalMembers, setTotalMembers] = useState();
  const [chartLoading, setChartLoading] = useState(true);
  const [chartData, setChartData] = useState();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  async function fetchData() {
    setInitializing(true);
    const value = await AsyncStorage.getItem("GYM");
    // console.log("function called");

    firestore()
      .collection("GYM")
      .doc(value)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setTotalServices(documentSnapshot.data().services);
          setTotalPlans(documentSnapshot.data().plans);
          setTotalMembers(documentSnapshot.data().members);
        }
      });

    // creating line chart to display
    setInitializing(false);
    fetchChartData(value);
    setRefreshing(false);
  }

  async function fetchChartData(email_id) {
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var labels = [];
    var d = new Date();
    d.setMonth(d.getMonth() - 4);
    labels.push(d.getMonth());

    var d = new Date();
    d.setMonth(d.getMonth() - 3);
    labels.push(d.getMonth());

    var d = new Date();
    d.setMonth(d.getMonth());
    labels.push(d.getMonth() - 2);

    var d = new Date();
    d.setMonth(d.getMonth() - 1);
    labels.push(d.getMonth());

    var d = new Date();
    d.setMonth(d.getMonth());
    labels.push(d.getMonth());

    d.setMonth(d.getMonth() + 1);
    labels.push(d.getMonth());

    var month_labels = [];
    labels.forEach((index) => {
      month_labels.push(months[index]);
    });

    // var d = new Date();
    var start_date = new Date("1/" + (labels[0] + 1) + "/" + d.getFullYear());

    const members = await firestore()
      .collection("GYM")
      .doc(email_id)
      .collection("MEMBERS")
      .where("joining_date", ">", start_date)
      .get();

    var memberCount = [0, 0, 0, 0, 0, 0];
    members.docs.map((item) => {
      var data = item._data;
      var date = new Date(1970, 0, 1);
      date.setSeconds(data.joining_date.seconds);
      memberCount[date.getMonth() - labels[0]]++;
      // console.log(date);
    });

    setChartData({
      labels: month_labels,
      datasets: [
        {
          data: memberCount,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
          strokeWidth: 2, // optional
        },
      ],
      legend: ["Members count"], // optional
    });
    setChartLoading(false);
  }

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
  } else {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View styles={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Universal GYM</Text>
          </View>
          <View style={styles.body}>
            <View style={styles.row}>
              <Card
                width={"100%"}
                count={totalMembers}
                title={"Members"}
                intent={"Members"}
              />
            </View>
            <View style={styles.row}>
              <Card
                width={"45%"}
                count={totalPlans}
                title={"Plans"}
                intent={"Plans"}
              />
              <Card
                width={"45%"}
                count={totalServices}
                title={"Services"}
                intent={"Services"}
              />
            </View>
            <View style={styles.chart}>
              {chartLoading == true ? (
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
              ) : (
                <LineChart
                  data={chartData}
                  withInnerLines={false}
                  withDot={false}
                  style={{
                    // marginVertical: 8,
                    borderRadius: 20,
                  }}
                  width={Dimensions.get("window").width - 40}
                  height={256}
                  verticalLabelRotation={30}
                  chartConfig={chartConfig}
                  bezier
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
};

export default HomeScreen;

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
    padding: 20,
    marginTop: -30,
    overflow: "hidden",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: "#fff",
    marginBottom: 100,
  },
  row: {
    flexDirection: "row",
    marginVertical: 15,
    justifyContent: "space-between",
  },
  chart: {
    marginTop: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    // height: 256,
  },
});
