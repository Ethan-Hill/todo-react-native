import React, { useState, useEffect } from "react"
import Toast from "react-native-toast-message"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  StyleSheet,
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
      // saving error
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("StoredTasks")
      return jsonValue != null ? JSON.parse(jsonValue) : []
    } catch (e) {
      // error reading value
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
        bottomOffset: 150,
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
      bottomOffset: 150,
    })
  }

  return (
    <View style={styles.container}>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      {/* Today's Tasks */}
      <View style={styles.textWrapper}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>

        <View style={styles.items}>
          {/* This is where the tasks go */}
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
        style={styles.writeTaskWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder={"Write a task"}
          value={task}
          onChangeText={(text) => setTask(text)}
        ></TextInput>
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}> +</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1e1e1",
  },
  textWrapper: { paddingTop: 80, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 24, fontWeight: "bold" },
  items: { margin: 30 },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    width: 250,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  addText: {},
})
