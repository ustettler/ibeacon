import { StyleSheet, View, Animated, } from 'react-native'
import React, { useEffect } from 'react'


export const Splash = ({ route, navigation }) => {
    const scale = new Animated.Value(1);


    useEffect(() => {
        Animated.sequence([
            Animated.timing(scale, {
                toValue: 3.5,
                duration: 1500,
                useNativeDriver: true
            }),
            Animated.timing(scale, {
                toValue: 2,
                duration: 800,
                useNativeDriver: true
            }),
        ]).start(({ finished }) => {
            // navigation.navigate(SCREENS.AUTHROUTES)
        });
        return () => {

        }
    }, [])


    return (
        <View style={styles.container} >
            <Animated.Image
                source={require('../../assets/images/splash.png')}
                style={{
                    width: 80,
                    height: 80,
                    transform: [{ scale: scale }]
                }}
                resizeMode='contain'
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#1e1f24",
    }
})