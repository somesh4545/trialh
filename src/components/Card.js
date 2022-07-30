import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";

const Card = (props) => {
  const navigation = useNavigation();
  return (
    <View
      style={[props.width != null ? { width: props.width } : null, styles.card]}
    >
      <TouchableOpacity
        onPress={() => {
          if (props.membersData) {
            navigation.navigate(props.intent, {
              membersData: props.membersData,
              loaded: true,
            });
          } else {
            navigation.navigate(props.intent);
          }
        }}
      >
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle}>{props.title}</Text>

          <Entypo name="chevron-right" size={25} color="#2f50c9" />
        </View>
        <View style={styles.cardBottom}>
          <Text style={styles.cardTextBold}>{props.count}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardTop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 20,
  },
  cardBottom: {
    fontSize: 20,
  },
  cardTextBold: {
    paddingTop: 10,
    fontSize: 22,
    fontWeight: "700",
  },
});
