import React, { Component } from "react";
import { StyleSheet, View, Platform, Vibration, SafeAreaView, Image } from "react-native";
import { BleManager } from "react-native-ble-plx";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification, { Importance } from "react-native-push-notification";
import Pulse from "react-native-pulse";
import { Item } from "./components/Item";
import { Header } from "./components/Header";



//Variable to store beacon UUID
const BEACON_UUID = "ACFD065E-C3C0-11E3-9BBE-1A514932AC01";

//setting time duration for vibration
const ONE_SECOND_IN_MS = 1000;
const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  3 * ONE_SECOND_IN_MS
];




export default class BeaconScreen extends Component {
  constructor(props) {
    super(props);

    //creating obiect of beacon manager for utilising its methods
    this.manager = new BleManager();
    this.state = {
     rssi:0
    };
  }

  
  componentDidMount() { 
    this.configurePushNotification();
    // Here intiating beacon scanning
    this.scanAndConnect();
  }

  //Method for scaning beacon, getting rssi value if its detected
  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      console.log(":::::::::::Scan And Connect::::::::::");

      //Put check here app will only work on vour beacon
//BEACON_UUID=> created variable for beacon UUID store
if (device != null && device.uuid == BEACON_UUID) { 
        let dis = this.calculateAccuracy(-69, device.rssi)
        this.setState({ rssi: dis.toFixed(2) })
        this.stopMethod()
        if (dis > 1 && dis < 5) {
          this.callPushNotification()
          this.startVibration();
        }
      } else {
        this.stopMethod()
        this.stopVibration();
      }
    });
  }

  //Here we configuring push notification
  configurePushNotification = () =>{
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) { console.log("TOKEN:", token); },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) { notification.finish(PushNotificationIOS.FetchResult.NoData); },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) { },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    }); 
  }

  //Method to start phone vibration
   startVibration = () => {
    //Vibrate with pattern until cancelled
     Vibration.vibrate(PATTERN, true);
  };

  //Method to stop phone vibration
   stopVibration = () => {
    //To Stop the vibration
    Vibration.cancel();
  };

  //Method to call push notification
  callPushNotification = () =>{
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: 'default-channel-id',
      ticker: 'My Notification Ticker', // (optional)
      autoCancel: true,
      largeIcon: 'ic_launcher', 
      smallIcon: 'ic_notification',
      bigText: 'Did you lock the door. Please Lock the door before leaving home', // (optional) default: "message" prop
      color: 'red', 
      vibrate: true, 
      vibration: 300, 
      tag: 'some_tag', 
      group: 'group', 
      groupSummary: false, 
      ongoing: false, 
      actions: ['Yes', 'No'],
      invokeApp: true, 

      when: null,
      usesChronometer: false,
      timeoutAfter: null,

      /* iOS only properties */
      category: '', // (optional) default: empty string
      subtitle: "Reminder", // (optional) smaller title below notification title

      /* iOS and Android properties */
      id: 1, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: 'Door Lock Reminder!', // (optional)
      message: 'Did you lock the door. Please Lock the door before leaving home', // (required)
      userInfo: { screen: 'home' }, // (optional) default: {} (using null throws a JSON value '<null>' error)
      number: 10,
    })
  }
  
  /* Controlling the time cycle after how many seconds beacon should
   again check its rssi value
   to get distance from phone to beacon */
  stopMethod() {
    this.manager.stopDeviceScan();
    setTimeout(() => {
      this.scanAndConnect()
    }, 2000);
  }

  //Calculating Distance using rssi value
  calculateAccuracy( txPower, rssi) {
    if (rssi == 0) {
      return -1.0; // if we cannot determine accuracy, return -1.
    }
    var ratio = rssi * 1.0 / txPower;
    if (ratio < 1.0) {
      return Math.pow(ratio, 10);
    }
    else {
    var accuracy = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
      return accuracy;
    }
  }   


  componentWillUnmount() {
    this.manager.destroy()
  }

  render() {
      return (
        <SafeAreaView style={styles.container}>
          <Header />
          <View style={styles.top}>
            <View style={styles.itemRow}>
              <Item bg={"#1B3766"} wd={43.5} label={"Beacon Detected"} count={this.state.rssi > 0 ? "YES" : "NO"} icon={require('../assets/images/wifi.png')} />
              <Item bg={"#475CE1"} wd={43.5} label={"Distance"} count={`${this.state.rssi} m`} icon={require('../assets/images/distance.png')} />
            </View>
          </View>
          <View style={styles.bottom}>
            <Pulse color='#3FC76C' numPulses={3} diameter={400} speed={20} duration={2000} />
            <Image source={require('../assets/images/bluetoothIcon.png')} style={styles.bleIcon} />
          </View>
        </SafeAreaView>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    headerContianer:{
      width:'100%',
      height:70,
      backgroundColor:'#1B3766',
      alignItems:'center'
    },
    headerRow:{
      width:'90%',
      height:70,
      flexDirection:'row',
      alignItems:'center',
    },
    label:{
      color:'#FFFFFF',
      fontWeight:'600'
    },
    top:{
      flex:0.2
    },
    itemRow: {
      width: '90%',
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    },
    bottom:{
      flex:0.8,
      justifyContent:'center',
      alignItems:'center'
    },
    bleIcon:{
      width:15, 
      height:15
    }
})






// import { StyleSheet, Text, View, DeviceEventEmitter } from 'react-native'
// import React, { useEffect } from 'react'
// import Beacons from 'react-native-beacons-manager'

// const region = {
//     identifier: 'Estimotes',
//     uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D'
// };

// export const BeaconScreen = () => {

//     useEffect( () => {
//         Beacons.requestWhenInUseAuthorization();
//         Beacons.startMonitoringForRegion(region);
        
//         // Beacons.getAuthorizationStatus();
//         try {
//              Beacons.startRangingBeaconsInRegion(region)
//             console.log(`Beacons ranging started succesfully!`)
//         } catch (err) {
//             console.log(`Beacons ranging not started, error: ${err}`)
//         }
//         Beacons.startUpdatingLocation();
//         // OPTIONAL: listen to authorization change
//         const authStateDidRangeEvent = DeviceEventEmitter.addListener(
//             'authorizationStatusDidChange',
//             info => console.log('authorizationStatusDidChange: ', info),
//         );

//         // Ranging: Listen for beacon changes
//         const beaconsDidRangeEvent = DeviceEventEmitter.addListener(
//             'beaconsDidRange',
//             data => {
//                 console.log('beaconsDidRange event')
//                 console.log('beaconsDidRange, data: ', data);
//                 // this.setState({ message: 'beaconsDidRange event' });
//                 // // console.log('beaconsDidRange, data: ', data);
//                 // const updatedBeaconsLists = this.updateBeaconList(
//                 //     data.beacons,
//                 //     'rangingList',
//                 // );
//                 // this._beaconsLists = updatedBeaconsLists;
//                 // this.setState({
//                 //     beaconsLists: this.state.beaconsLists.cloneWithRowsAndSections(
//                 //         this._beaconsLists,
//                 //     ),
//                 // });
//             },
//         );

//         return () => {
//             // stop monitoring beacons:
//             Beacons.stopMonitoringForRegion(region)
//                 // .then(() => console.log('Beacons monitoring stopped succesfully'))
//                 .catch(error =>
//                     console.log(`Beacons monitoring not stopped, error: ${error}`),
//                 );

//             // stop ranging beacons:
//             Beacons.stopRangingBeaconsInRegion(region)
//                 // .then(() => console.log('Beacons ranging stopped succesfully'))
//                 .catch(error =>
//                     console.log(`Beacons ranging not stopped, error: ${error}`),
//                 );

//             // stop updating locationManager:
//             Beacons.stopUpdatingLocation();
//             authStateDidRangeEvent.remove();
//             beaconsDidRangeEvent.remove();

//         }
//     }, [])


//     return (
//         <View style={styles.container}>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         backgroundColor: 'red'
//     }
// })