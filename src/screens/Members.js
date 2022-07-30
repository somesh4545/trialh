import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";

import { FAB, Provider } from "react-native-paper";
import MemberCard from "./../components/MemberCard";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const data = [
  {
    id: 1,
    gender: "male",
    name: "john",
    plan: "12 month",
    planExpiry: "21st june",
    dueAmount: 100,
    phoneNumber: "808025983",
  },
  {
    id: 2,
    gender: "female",
    name: "bob",
    plan: "4 month",
    planExpiry: "21st june",
    dueAmount: 0,
    phoneNumber: "808025983",
  },
];

const Members = ({ route, navigation }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [initializing, setInitializing] = useState(true);
  const [text, setText] = useState("");
  useEffect(() => {
    if (route.params == null) {
      getMembers();
    } else {
      setAllUsers(route.params.membersData);
      setFilteredUsers(route.params.membersData);
      setInitializing(false);
    }
  }, []);

  const getMembers = async () => {
    try {
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
              injury,
              address,
              dob,
              profileImg,
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
              injury,
              address,
              dob,
              profileImg,
            });
          });
        });
      setAllUsers(membersList);
      setFilteredUsers(membersList);
      setInitializing(false);
    } catch (error) {
      console.log("eee" + error);
    }
  };

  const searchUser = (text) => {
    if (text) {
      const newData = allUsers.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredUsers(newData);
      setSearch(text);
    } else {
      setFilteredUsers(allUsers);
      setSearch(text);
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
    <>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        styles={styles.container}
      >
        <Provider>
          <View style={styles.body}>
            <View style={styles.SearchConatiner}>
              <TextInput
                style={styles.textInputStyle}
                onChangeText={(text) => searchUser(text)}
                value={search}
                placeholderTextColor="#000"
                underlineColorAndroid="transparent"
                placeholder="Search User"
              />
            </View>

            {filteredUsers.length == 0 ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  backgroundColor: "#fff",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "700" }}>
                  No members found
                </Text>
              </View>
            ) : (
              filteredUsers.map((item) => {
                // console.log(item.name);
                return <MemberCard key={item.id} data={item} />;
              })
            )}
          </View>
        </Provider>
      </ScrollView>
      <FAB
        color={"#fff"}
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("AddMember")}
      />
    </>
  );
};

export default Members;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  body: {
    height: "100%",
    padding: 20,
    backgroundColor: "#fff",
  },
  SearchConatiner: {
    marginBottom: 10,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: "#000",
    color: "#000",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 20,
    bottom: 30,
    backgroundColor: "#2f50c9",
  },
});
