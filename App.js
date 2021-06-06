import React, { useState, useEffect } from "react"
import Toast from "react-native-toast-message"
import AsyncStorage from "@react-native-async-storage/async-storage"
import tw from 'tailwind-react-native-classnames';

import {
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native"
import Task from "./components/Task"

export default function App() {
  const [task, setTask] = useState()
  const [taskItems, setTaskItems] = useState([])

  const AlertDialog = (index) =>
    Alert.alert(
      "Complete task",
      "Are you sure you want to complete this task?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => completeTask(index) },
      ]
    )

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem("StoredTasks", jsonValue)
    } catch (e) {
      console.log(e);
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("StoredTasks")
      return jsonValue != null ? JSON.parse(jsonValue) : []
    } catch (e) {
      console.log(e);
    }
  }

  const handleAddTask = () => {
    Keyboard.dismiss()
    if (task) {
      setTaskItems([...taskItems, task])
      setTask(null)
      storeData([...taskItems, task])
    } else {
      Toast.show({
        text1: "Error adding task!",
        text2: "Please make sure you are inputting text",
        type: "error",
        visibilityTime: 4000,
        autoHide: true,
        position: "bottom",
        bottomOffset: 100,
      })
    }
  }

  useEffect(() => {
    async function getStoredData() {
      const gotData = await getData()
      setTaskItems(gotData)
    }
    getStoredData()
  }, [])

  const completeTask = (index) => {
    let itemsCopy = [...taskItems]
    itemsCopy.splice(index, 1)
    setTaskItems(itemsCopy)
    storeData([...itemsCopy])
    Toast.show({
      text1: "Task completed!",
      type: "success",
      visibilityTime: 4000,
      autoHide: true,
      position: "bottom",
      bottomOffset: 100,
    })
  }

  return (
    <View style={tw`flex-1 bg-gray-200`}>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      <View style={tw`pt-20 px-8`}>
        <Text style={tw`text-2xl font-bold`}>Today's Tasks</Text>
        <View style={tw`m-8`}>
          {taskItems.map((task, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => AlertDialog(index)}>
                <Task text={task} />
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
		style={tw`absolute bottom-6 w-full items-center`}
      >
        <TextInput
		  style={tw`py-4 w-4/5 px-4 bg-white rounded-2xl border border-gray-300 border-solid`}
          placeholder={"Write a task"}
          value={task}
          onChangeText={(text) => setTask(text)}
		  onSubmitEditing={() => handleAddTask()}
        ></TextInput>
      </KeyboardAvoidingView>
    </View>
  )
}
