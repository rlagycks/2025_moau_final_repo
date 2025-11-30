import { StyleSheet, View, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'

const SearchBar = ({
    value, onChangeText,
    placeholder = "검색어를 입력하세요",
    onClear,
    showClear = false,
    style,
}) => {
  return (
    <View style={[styles.container, style]}>
        <Image source={require("../assets/img/searchIcon.png")}
        style={styles.icon} />

        <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#ADADAD"
        />

        {showClear && value?.length > 0 && (
            <TouchableOpacity onPress={onClear}>
                <Image source={require("../assets/img/CloseOutlineIcon.png")}
                style={styles.icon} />
            </TouchableOpacity>
        )}
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({
    container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: "#ccc",
    borderRadius: 17,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    width: 343,
    height: 45,
  },
  icon: {
    width: 23,
    height: 23,
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Freesentation-6SemiBold",
    color: "#ADADAD"
  },
})