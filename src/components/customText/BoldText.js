import React from "react";
import { Text } from "react-native";

const BoldText = ({style, children, ...props}) => {
    return (
        <Text
        {...props}
        style={[{fontFamily: "Freesentation-7Bold"}, style]}>
            {children}
        </Text>
    );
};

export default BoldText;