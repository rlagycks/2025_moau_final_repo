import React from "react";
import { Text } from "react-native";

const RegularText = ({style, children, ...props}) => {
    return (
        <Text
        {...props}
        style={[{fontFamily: "Freesentation-4Regular"}, style]}>
            {children}
        </Text>
    );
};

export default RegularText;