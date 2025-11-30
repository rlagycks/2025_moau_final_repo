import React from "react";
import { Text } from "react-native";

const SemiBoldText = ({style, children, ...props}) => {
    return (
        <Text
        {...props}
        style={[{fontFamily: "Freesentation-6SemiBold"}, style]}>
            {children}
        </Text>
    );
};

export default SemiBoldText;