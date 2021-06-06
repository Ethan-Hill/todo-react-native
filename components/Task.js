import React from "react"
import { View, Text, StyleSheet, Alert } from "react-native"
import tw from 'tailwind-react-native-classnames';

const Task = ({ text }) => {
  return (
    <View style={tw`bg-white p-4 rounded-lg flex-row items-center justify-between mb-6`}>
      <View style={tw`flex-row items-center flex-wrap`}>
        <View style={tw`w-6 h-6 bg-blue-300 bg-opacity-40 rounded-lg mr-4`}></View>
        <Text style={styles.itemText}>{text}</Text>
      </View>
      <View style={tw`w-4 h-4 border-blue-300 border-2 rounded-md`}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  itemText: {
    maxWidth: "80%",
  },
})

export default Task
