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
import FontAwsome5 from "react-native-vector-icons/FontAwesome5";
import { TextInput, Button } from "react-native-paper";
import auth from "@react-native-firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginFun = async () => {
    if (email.length == 0 && password.length == 0) {
      ToastAndroid.show(
        "Fill the required fields!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then(async () => {
          ToastAndroid.show(
            "Logged in successfully!",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
          await AsyncStorage.setItem("GYM", email);
          navigation.replace("Home", { email: email });
        })
        .catch((error) => {
          if (error.code === "auth/invalid-email") {
            // console.log('The email address is invalid!');
            ToastAndroid.show(
              "Invalid email address!",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          }
          if (error.code === "auth/wrong-password") {
            // console.log('The password does not matches the email id!');
            ToastAndroid.show(
              "Invalid password!",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          }

          console.log(error);
        });
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/background.png")}
          style={{ height: height / 2.5 }}
        >
          <View style={styles.UpperContainer}>
            <Text style={styles.BrandText}>GYM BOOK</Text>
          </View>
        </ImageBackground>
        <View style={styles.bottomContainer}>
          <View style={{ padding: 30 }}>
            <Text style={styles.WelcomeText}>Welcome</Text>
            <View
              style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
            >
              <Text style={styles.RegisterText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignUp")}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.RegisterSub}>Register Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formContainer}>
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
                label="Password"
                activeOutlineColor="#2F50C9"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
                mode="outlined"
              />
              <View style={styles.forgotPassword}>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 15, fontWeight: "bold", color: "#000" }}
                  >
                    Forgot Password?
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ width: "30%" }}
                  // icon="camera"
                  mode="outlined"
                  onPress={() => navigation.navigate("ForgotPass")}
                >
                  <Text
                    style={{
                      color: "#2F50C9",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Reset
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.loginBtnContainer}>
                <Button
                  style={{
                    width: "60%",
                    borderRadius: 30,
                    elevation: 5,
                    backgroundColor: "#2F50C9",
                  }}
                  mode="contained"
                  onPress={() => loginFun()}
                >
                  Login
                </Button>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

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
    // marginTop:
  },
  BrandText: {
    marginTop: 10,
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
    marginTop: 40,
    // marginBottom: 30,
  },
  otherLoginConatiner: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
