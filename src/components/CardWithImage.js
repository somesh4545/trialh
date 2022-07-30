import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const CardWithImage = props => {
  const navigation = useNavigation();
  return (
    <View
      style={[props.width != null ? {width: props.width} : null, styles.card]}>
      <TouchableOpacity onPress={() => {navigation.navigate(props.intent)}}>
        <View style={styles.cardTop}>
          <AntDesign name={props.icon} size={25} color="#2f50c9" />
        </View>
        <View style={styles.cardBottom}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {props.title}
          </Text>
          {/* <Text style={styles.cardTextBold}>{props.count}</Text> */}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardWithImage;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    // height: 150,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
  },
  cardBottom: {
    fontSize: 20,
  },
  cardTextBold: {
    paddingTop: 10,
    fontSize: 25,
    fontWeight: '700',
  },
});
