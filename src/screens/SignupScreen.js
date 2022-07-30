import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { TextInput, Button } from "react-native-paper";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const { width, height } = Dimensions.get("window");
const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [gymname, setGymname] = useState("");
  const [owner, setOwner] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const RegisterGym = async () => {
    if (
      email.length == 0 &&
      gymname.length == 0 &&
      phone.length == 0 &&
      password.length == 0
    ) {
      ToastAndroid.show(
        "Fill the required fields!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      var today = new Date();
      var expiry_date = new Date();
      expiry_date.setDate(today.getDate() + 30);
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          firestore()
            .collection("GYM")
            .doc(email)
            .set({
              id: email,
              email: email,
              gymname: gymname,
              owner: owner,
              phone: phone,
              password: password,
              date: today,
              expiry_date: expiry_date,
              plans: "0",
              services: "0",
              members: "0",
            })
            .then(() => {
              console.log("User added to firebase");
            });
          ToastAndroid.show(
            "Account created successfully!",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          navigation.replace("Login");
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            // console.log('That email address is already in use!');
            ToastAndroid.show(
              "That email address is already in use!",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          }

          if (error.code === "auth/invalid-email") {
            // console.log('That email address is invalid!');
            ToastAndroid.show(
              "The email address is invalid!",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          }
          if (error.code === "auth/weak-password") {
            // console.log('Password should be more than 6 digits!');
            ToastAndroid.show(
              "Password should be more than 6 digits!",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          }

          console.error(error);
        });
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/background.png")}
          style={{ height: height / 2.5 }}
        >
          <View style={styles.UpperContainer}>
            {/* <FontAwsome5
                name="motorcycle"
                size={60}
                style={{color: '#fff'}}
              /> */}

            <Text style={styles.BrandText}> GYM BOOK</Text>
          </View>
        </ImageBackground>
        <View style={styles.bottomContainer}>
          <View style={{ padding: 30 }}>
            <Text style={styles.WelcomeText}>Create an account</Text>
            <View
              style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
            >
              <Text style={styles.RegisterText}>Already an user? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.RegisterSub}>Login Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.inputContainer}
                label="Gym Name"
                activeOutlineColor="#2F50C9"
                value={gymname}
                onChangeText={(text) => setGymname(text)}
                mode="outlined"
              />

              <TextInput
                style={styles.inputContainer}
                label="Owner name"
                activeOutlineColor="#2F50C9"
                value={owner}
                onChangeText={(text) => setOwner(text)}
                mode="outlined"
              />

              <TextInput
                style={styles.inputContainer}
                label="Email"
                activeOutlineColor="#2F50C9"
                value={email}
                onChangeText={(text) => setEmail(text)}
                mode="outlined"
              />
              <TextInput
                style={styles.inputContainer}
                label="Phone"
                activeOutlineColor="#2F50C9"
                keyboardType="numeric"
                value={phone}
                onChangeText={(text) => setPhone(text)}
                mode="outlined"
              />

              <TextInput
                style={styles.inputContainer}
                label="Password"
                activeOutlineColor="#2F50C9"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
                mode="outlined"
              />

              <View style={styles.loginBtnContainer}>
                <Button
                  style={{
                    width: "60%",
                    borderRadius: 30,
                    elevation: 5,
                    backgroundColor: "#2F50C9",
                  }}
                  mode="contained"
                  onPress={() => RegisterGym()}
                >
                  SignUp
                </Button>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    display: "flex",
    // justifyContent: 'center',
    // alignItems: "center",
    flex: 1,
  },
  UpperContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  BrandText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },
  bottomContainer: {
    flex: 1.5,
    bottom: 60,
    backgroundColor: "#fff",
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
  },
  WelcomeText: {
    fontSize: 30,
    color: "#2F50C9",
    fontWeight: "bold",
  },
  RegisterText: {
    fontSize: 15,
    color: "#000",
  },
  RegisterSub: {
    fontSize: 15,
    color: "#2F50C9",
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  forgotPassword: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loginBtnContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  otherLoginConatiner: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
  },
  boxContainer: {
    width: 100,
    height: 30,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    marginTop: 5,
  },
  box: {
    flex: 1,
    flexDirection: "row",
    width: 80,
    justifyContent: "space-around",
    // justifyContent: 'center',
    alignItems: "center",
  },
});
