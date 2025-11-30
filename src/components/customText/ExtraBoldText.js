import React from "react";
import { Text } from "react-native";

const ExtraBoldText = ({style, children, ...props}) => {
    return (
        <Text
        {...props}
        style={[{fontFamily: "Freesentation-8ExtraBold"}, style]}>
            {children}
        </Text>
    );
};

export default ExtraBoldText;