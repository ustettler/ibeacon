import { StyleSheet, Text, View, Image, } from 'react-native'
import React, { useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export const Item = ({ bg, wd, label, count, icon }) => {
    return (
        <View style={[styles.itemContainer, { backgroundColor: bg, width: wp(wd) }]}>
            <View style={{ width: '60%' }} >
                <Text style={styles.itemLabel} >{label}</Text>
                <Text style={styles.itemCount} >{count}</Text>
            </View>
            <Image source={icon} style={{ width: wp(12), height: wp(12) }} />
        </View>
    )
}


const styles = StyleSheet.create({
    itemContainer: {
        width: wp(43.5),
        backgroundColor: '#1c2025',
        height: 100,
        marginBottom: 15,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12
    },
    itemLabel: {
        width: '100%',
        color: "#FFFFFF",
        fontSize: wp(3),
        fontWeight: '600'
    },
    itemCount: {
        color: "#FFFFFF",
        fontSize: wp(6),
        fontWeight: '500'
    }
})