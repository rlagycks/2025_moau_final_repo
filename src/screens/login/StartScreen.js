import React from "react";
import { View, StyleSheet, Image } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import BoldText from '../../components/customText/BoldText';

const StartScreen = ({navigation}) => {

    const onSwipeLeft = () => {
        navigation.navigate("Login");
    };

    return(
        <GestureRecognizer
        onSwipeLeft={onSwipeLeft}
        style={styles.container}>
                <View style={styles.iconContainer}>
                    <Image source={require('../../assets/img/startIcon.png')} 
                    style={styles.iconStyle}/>
                </View>
                <View style={styles.textContainer}>
                    <BoldText style={styles.textStyle}>
                        Turning Cents into Sense
                    </BoldText>
                </View>
        </GestureRecognizer>
        
    );
}

export default StartScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#7242E2",
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: "center"
    },
    iconContainer: {
        marginLeft: 40,
        marginBottom: 30,
        marginTop: 45,
    },
    iconStyle: {
        width: 340,
        height: 390,
    },
    textContainer: {
        width: 237,
        marginTop: 30,
        marginRight: 70,
    },
    textStyle: {
        fontSize: 55,
        color: "#FFFFFF",
    }
})