import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

export const Header = () =>{
    return <View style={styles.headerContianer}>
        <View style={styles.headerRow} >
            <Text style={styles.label} >Beacon Radar</Text>
        </View>
    </View>
}

const styles = StyleSheet.create({
    headerContianer: {
        width: '100%',
        height: 70,
        backgroundColor: '#1B3766',
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