import { Text, View, StyleSheet } from "react-native"
import { WebView } from 'react-native-webview'
import { Button } from '@rneui/themed';
import { siteUrl, domainUrl } from '../config'
//import GetLocation from "../components/GetLocation";
import { useState, useRef, useEffect, createRef } from 'react'
import * as Location from 'expo-location';
import { getGeoLocationJS } from "../components/getGeoLocationJS";
import { changeLocation } from "../components/changeLocation";
import {PermissionsAndroid} from 'react-native';
//import { Permission, PERMISSION_TYPE } from "../components/AppPermissions";

//Note to self: Issue is getting location to work.  navigator.geolocation.getCurrentPosition() works on website but not through webview due to "insecure origins" (http not https)
//On RN Location.getCurrentPositionAsync is working but need to pass data to webview
//eventlistener variables logging properly with JSON.stringify(event.data) (injectJavaScript)
// RN button needs to get current location on press and send message to webview (web app)
// RNMap.js in web app needs to take incoming message and setMapCenter.
//for webview console logs: https://developerjesse.com/2021/04/07/console-logs-react-native-webview.html 

const MapScreen = () => {

  const webviewRef = useRef();

  const [location, setLocation] = useState({"coords": {"latitude": "", "longitude": ""}});
  const [locationCenter, setLocationCenter] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  //const [mapCenter, setMapCenter] = useState({})

  const requestLocationPermission = async () => {
    try {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
        'title': 'Location Access Permission',
        'message': 'Farmstand Finder would like to access your location'
        }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
    } else {
        console.log("Location permission denied")
    }
    } catch (err) {
    console.warn(err)
    }
}

useEffect(() => {
  webviewRef.current.reload();
}, [])

useEffect(() => {
  requestLocationPermission()
}, [])

  useEffect(() => {
    (async () => {      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        console.log("errorMsg:", errorMsg)
        return;
      } else {
        console.log("location permission granted")
      }
      console.log("getforegroundpermissionsasync", Location.getForegroundPermissionsAsync())
      console.log("getbackgroundpermissionsasync", Location.getBackgroundPermissionsAsync())
      console.log("currentLocation1: ", currentLocation)
      console.log("Location", Location.getCurrentPositionAsync())
      let currentLocation = await Location.getLastKnownPositionAsync({});
      console.log("currentLocation2: ", currentLocation)
      setLocation(currentLocation);
      await setLocationCenter(`[
        ${currentLocation.coords.latitude},
        ${currentLocation.coords.longitude}
      ]`)
      webviewRef.current.postMessage(`${locationCenter}`)
    })();
  }, []);

  const mapScreenStyle = StyleSheet.create({
    container: {
      marginTop: 30,
      backgroundColor: '#000',
      alignItems: 'center',
    }
  })

  const buttonRowStyle = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    }
  })

  const setWebviewCenter = async () => {
    console.log("webviewRef1: ", webviewRef)
    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        console.log("errorMsg:", errorMsg)
        return;
      } else {
        console.log("location permission granted")
      }
      let currentLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 10000});
      setLocation(currentLocation);
      await setLocationCenter(`[
        "locationCtr",
        ${currentLocation.coords.latitude},
        ${currentLocation.coords.longitude}
      ]`)
      console.log("locationCenter", locationCenter)
      console.log("webviewRef.current", webviewRef.current)
      webviewRef.current.postMessage(locationCenter)
      //  This works! webviewRef.current.postMessage(`${locationCenter}`)
      // somewhat works for object webviewRef.current.postMessage(JSON.stringify({locationCenter: `${locationCenter}`}))
      //webviewRef.current.postMessage({locationCenter: `${locationCenter}`})
  }

  const sendMessageToWebView = async () => {
    console.log("webviewRef: ", webviewRef)
    console.log("webviewRef toString", JSON.stringify(webviewRef.current.toString()))
    console.log("injectJavaScript: ", webviewRef.current.injectJavaScript)
    console.log("postMessage: ", webviewRef.current.injectJavaScript(`console.log("window", window.ReactNativeWebView)`))

    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        console.log("errorMsg:", errorMsg)
        return;
      } else {
        console.log("location permission granted")
      }
    
    const testLocation = "[-33.87, 151.21]"
    
    webviewRef.current.postMessage(`${testLocation}`)
    //webviewRef.injectJavaScript(`
    // window.ReactNativeWebView.postMessage(JSON.stringify({message: "hello-window", data: ${testLocation}}))
    // true
    // `)
    // webviewRef.injectJavaScript(`
    // window.ReactNativeWebView.postMessage({message: "hello", data: "hellodata"})
    // true
    // `)
    // webviewRef.current.injectJavaScript(`
    // document.ReactNativeWebView.postMessage(JSON.stringify({message: "hello-document", data: ${testLocation}}))
    // true
    // `)
  }

  const allFarmstandsMap = siteUrl

  const addEventListener = `
  console.log("window: ", window)
  console.log("document: ", document)
  document.addEventListener('message', function(event) {console.log("testing onmessage event from injected: ", JSON.stringify(event.data))})
  document.ReactNativeWebView.postMessage({message: "hello"})
  true
  `

  return(
    <View style={mapScreenStyle.container}>
    <View style={{ width: '100%', height: '100%' }} >
      <WebView
        //originWhitelist={domainUrl}
        originWhitelist={'*'}
        ref={WEB_REF => webviewRef.current = WEB_REF}
        source={{ uri: allFarmstandsMap }}
        onLoad={console.log('loaded allfarmstands.com homepage')}
        javaScriptEnabled={true}
        geolocationEnabled={true}
        injectedJavaScript={addEventListener}
        startInLoadingState={ true }
        onMessage={ event => {
          console.log("onmessage event: ", event)
        }}
      />
      <View  style={buttonRowStyle.container}>
        <Button style={{width:'25%', margin: 0 }} >Primary</Button>
        <Button color="secondary" style={{width:'25%', margin: 0 }} >Secondary</Button>
        <Button 
        color="warning" 
        style={{width:'25%'}} 
        onPress={() => sendMessageToWebView() } 
        >Warning</Button>
        <Button 
        color="error" 
        style={{width:'25%'}} 
        onPress={() => setWebviewCenter() } 
        >Error</Button>
      </View>
    {/* <View>
      <Button
        title="send data"
        buttonStyle={{
          backgroundColor: 'rgba(90, 154, 230, 1)',
          borderWidth: 2,
          borderColor: 'black',
          borderRadius: 10
        }}
        containerStyle={{
          width: 200,
          marginHorizontal: 50,
          marginVertical: 10,
        }}
      />
    </View> */}
    </View>
    </View>
  )
}



export default MapScreen