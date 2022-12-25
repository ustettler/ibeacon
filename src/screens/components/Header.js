import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

export const Header = () =>{
    return <View style={styles.headerContianer}>
        <View style={styles.headerRow} >
            <Text style={styles.label} >ReAlert - Doorlock Reminder by reeagle</Text>
        </View>
    </View>
}

const styles = StyleSheet.create({
    headerContianer: {
        width: '100%',
        height: 70,
        backgroundColor: '#1c2025',
        alignItems: 'center'
    },
    headerRow: {
        width: '90%',
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        color: '#FFFFFF',
        fontWeight: '600'
    },
   
})