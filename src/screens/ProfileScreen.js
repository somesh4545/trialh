import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";

import { Avatar } from "react-native-paper";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState("");
  const [gymname, setGymname] = useState("");
  const [ownername, setOwnername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [totalServices, setTotalServices] = useState("");
  const [totalPlans, setTotalPlans] = useState("");
  const [totalMembers, setTotalMembers] = useState();
  const [expiryDate, setExpiryDate] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const value = await AsyncStorage.getItem("GYM");
    console.log("function called");

    firestore()
      .collection("GYM")
      .doc(value)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          // console.log('User data: ', documentSnapshot.data());
          setGymname(documentSnapshot.data().gymname);
          setOwnername(documentSnapshot.data().owner);
          setPhone(documentSnapshot.data().phone);
          setEmail(documentSnapshot.data().email);
          setTotalServices(documentSnapshot.data().services);
          setTotalPlans(documentSnapshot.data().plans);
          setTotalMembers(documentSnapshot.data().members);
          var expiry_date = documentSnapshot.data().expiry_date;

          var date = new Date(Date.UTC(1970, 0, 1)); // Epoch
          date.setUTCSeconds(expiry_date.seconds);

          date =
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear();

          setExpiryDate(date);
        }
      });
  }

  const logout = async () => {
    await AsyncStorage.removeItem("GYM");
    navigation.replace("Login");
  };

  return (
    <ScrollView>
      <View styles={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.upperConatiner}>
            <View style={styles.ImageNdName}>
              <Avatar.Image
                style={styles.avatar}
                size={65}
                source={require("../assets/user.png")}
              />
              <View style={styles.TileSubtitle}>
                <Text style={styles.GymName}>{gymname + " Fitness"}</Text>
                <Text style={styles.OwnerName}>{ownername}</Text>
                <Text style={{ fontSize: 17 }}>Plan expiry: {expiryDate}</Text>
              </View>
            </View>
            <View style={styles.contactInfo}>
              <View style={styles.contactCard}>
                <FontAwesome5
                  style={styles.contactSymbol}
                  name="phone"
                  size={20}
                  color={"#000"}
                />
                <Text style={styles.phoneNumber}>{phone}</Text>
              </View>
              <View style={styles.contactCard}>
                <FontAwesome5
                  style={styles.contactSymbol}
                  name="envelope"
                  size={20}
                  color={"#000"}
                />
                <Text style={styles.emailId}>{email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.middleContainer}>
            <View style={styles.components}>
              <TouchableOpacity>
                <View style={styles.card}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      color: "#2f50c9",
                    }}
                  >
                    {totalMembers}
                  </Text>
                  <Text style={styles.componentText}>Members</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View style={styles.card}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      color: "#2f50c9",
                    }}
                  >
                    {totalPlans}
                  </Text>
                  <Text style={styles.componentText}>Plans</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View style={styles.card}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      color: "#2f50c9",
                    }}
                  >
                    {totalServices}
                  </Text>
                  <Text style={styles.componentText}>Services</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.LowerContainer}>
            <View style={styles.TabList}>
              <TouchableOpacity>
                <View style={styles.listItem}>
                  <View style={styles.Icon}>
                    <FontAwesome5 name="download" size={22} color={"#2f50c9"} />
                  </View>
                  <View style={styles.ListTextContainer}>
                    <Text style={styles.ListText}>Download members list</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.listItem}>
                  <View style={styles.Icon}>
                    <FontAwesome5 name="bullhorn" size={22} color={"#2f50c9"} />
                  </View>
                  <View style={styles.ListTextContainer}>
                    <Text style={styles.ListText}>Tell a friend</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Subscription");
                }}
              >
                <View style={styles.listItem}>
                  <View style={styles.Icon}>
                    <FontAwesome5 name="wallet" size={22} color={"#2f50c9"} />
                  </View>
                  <View style={styles.ListTextContainer}>
                    <Text style={styles.ListText}>Upgrade subscription</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.listItem}>
                  <View style={styles.Icon}>
                    <FontAwesome5 name="question" size={22} color={"#2f50c9"} />
                  </View>
                  <View style={styles.ListTextContainer}>
                    <Text style={styles.ListText}>How to use gymbook</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.listItem}>
                  <View style={styles.Icon}>
                    <FontAwesome5 name="info" size={22} color={"#2f50c9"} />
                  </View>
                  <View style={styles.ListTextContainer}>
                    <Text style={styles.ListText}>
                      FAQ ( issues and queries )
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={logout}>
                <View style={styles.listItem}>
                  <View style={styles.Icon}>
                    <FontAwesome5
                      name="sign-out-alt"
                      size={22}
                      color={"#2f50c9"}
                    />
                  </View>
                  <View style={styles.ListTextContainer}>
                    <Text style={styles.ListText}>Logout</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

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
  },
  upperConatiner: {
    padding: 20,
  },
  ImageNdName: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {},
  TileSubtitle: {
    marginLeft: 20,
    display: "flex",
    flexDirection: "column",
  },
  GymName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  OwnerName: {},
  contactInfo: {
    padding: 20,
    marginTop: 5,
  },
  contactCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  contactSymbol: {
    marginRight: 10,
    opacity: 0.5,
  },
  phoneNumber: {
    opacity: 0.5,
    color: "#000",
  },
  emailId: {
    opacity: 0.5,
  },

  middleContainer: {
    backgroundColor: "#fff",
    marginTop: -20,
    borderRadius: 30,
    padding: 25,
    marginHorizontal: 20,
    elevation: 5,
  },
  components: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  componentText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },

  LowerContainer: {
    padding: 20,
    marginTop: 10,
    marginBottom: 70,
    // backgroundColor: '#F3F3F3',
  },
  TabList: {},
  listItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    padding: 10,
    // backgroundColor: 'grey'
  },
  Icon: {},
  ListTextContainer: {
    marginLeft: 20,
  },
  ListText: {
    color: "#000",
    fontSize: 18,
    // fontWeight: "bold",
  },
});
