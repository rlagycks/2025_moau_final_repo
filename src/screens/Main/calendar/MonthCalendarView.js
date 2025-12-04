import React, { useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView } from 'react-native';
import CalendarView from "./CalendarView";

const MonthCalendarView = ({ route }) => {
    const calendarRef = useRef(null);
    const teamId = route?.params?.teamId ?? null;

    useEffect(() => {
        calendarRef.current?.setModeExternally("month");
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                <CalendarView ref={calendarRef} initialMode="month" teamId={teamId} />
            </ScrollView>
            
        </View>
    );
}

export default MonthCalendarView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: 80,
        padding: 12,
    }
})
