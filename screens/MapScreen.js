import { Text, View, StyleSheet } from "react-native"
import { WebView } from 'react-native-webview'
import { Button } from '@rneui/themed';
import { siteUrl, domainUrl } from '../config'
//import GetLocation from "../components/GetLocation";
import { useState, useRef, useEffect } from 'react'
import * as Location from 'expo-location';
import { getGeoLocationJS } from "../components/getGeoLocationJS";
import { changeLocation } from "../components/changeLocation";
import {PermissionsAndroid} from 'react-native';
//import { Permission, PERMISSION_TYPE } from "../components/AppPermissions";

//Note to self: Issue is getting location to work.  navigator.geolocation.getCurrentPosition() works on website but not through webview due to "insecure origins" (http not https)
//On RN Location.getCurrentPositionAsync is working but need to pass data to webview
//eventlistener picking up webpackWarnings but not messages sent via button (injectJavaScript)
// this.webviewRef.postMessage("hello") is sending message to webview.  need to send message with data and have it read properly (i.e. JSON.stringify)
//Must learn how to send variable values in postMessage
//for webview console logs: https://developerjesse.com/2021/04/07/console-logs-react-native-webview.html 

const MapScreen = () => {

  //const [webviewRef, setWebviewRef] = useState(null)
  let webviewRef

  const [location, setLocation] = useState({"coords": {"latitude": "", "longitude": ""}});
  const [locationCenter, setLocationCenter] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [mapCenter, setMapCenter] = useState({})

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
        if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            console.log(position.coords.latitude,'success');
            },
            (error) => {
            console.log(error,'fail')
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
        );
        } else {console.log("problem")}

    } else {
        console.log("Location permission denied")
    }
    } catch (err) {
    console.warn(err)
    }
}

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

      console.log("currentLocation1: ", currentLocation)
      console.log("Location", Location.getCurrentPositionAsync())
      let currentLocation = await Location.getLastKnownPositionAsync({});
      console.log("currentLocation2: ", currentLocation)
      setLocation(currentLocation);
      await setLocationCenter([
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      ])
      console.log("currentLocation3: ", currentLocation)
      console.log("location", location)
      console.log("locationCenter", locationCenter)
      const testLocation = [45.4, 39.2]
      //this.webviewRef.injectJavaScript(`setMapCenter(${locationCenter}))
      //console.log("locationCenterInjected: ", locationCenter`)
      this.webviewRef.injectJavaScript(`window.ReactNativeWebView.postMessage({message: "${testLocation}"}))
      console.log("locationCenterInjected: ", "${testLocation}"`)
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

  useEffect(() => {
    console.log("webviewRef", this.webviewRef)
  }, [this.webviewRef])

  const setWebviewCenter = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        console.log("errorMsg:", errorMsg)
        return;
      } else {
        console.log("location permission granted")
      }

      let currentLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 10000});
      console.log("currentLocation: ", currentLocation)
      setLocation(currentLocation);
      setLocationCenter([
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      ])      
      console.log("location", location)
      console.log("locationCenter", locationCenter)

    this.webviewRef.injectJavaScript(`setMapCenter(${locationCenter}))
    console.log("locationCenterInjected: ", locationCenter`)
    console.log("locationCenter", JSON.stringify(locationCenter))
  }

  console.log("testing.....")
  console.log(window)
  console.log(locationCenter)

  const injectedFn = 
    `setMapCenter([46.95, 39]);
    true;`

  const sendMessageToWebView = async () => {
    console.log("webviewRef: ", this.webviewRef)
    console.log("injectJavaScript: ", this.webviewRef.injectJavaScript)
    console.log("postMessage: ", this.webviewRef.injectJavaScript(`console.log("window", window.ReactNativeWebView)`))

    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        console.log("errorMsg:", errorMsg)
        return;
      } else {
        console.log("location permission granted")
      }
    //let currentLocation = await Location.getCurrentPositionAsync({});
    // setLocationCenter([
    //   currentLocation.coords.latitude,
    //   currentLocation.coords.longitude
    // ])   

    //console.log("location: ", location)
    //console.log("locationCenter: ", locationCenter)
    const testLocation = [45.4, 39.2]
    this.webviewRef.postMessage("hello")
    this.webviewRef.injectJavaScript(`
    window.ReactNativeWebView.postMessage(JSON.stringify({message: "hello", data: ${testLocation}}))
    true
    `)
    this.webviewRef.injectJavaScript(`
    document.ReactNativeWebView.postMessage(JSON.stringify({message: "hello", data: ${testLocation}}))
    true
    `)
    console.log("postMessage after sending message: ", this.webviewRef.injectJavaScript(`console.log("window after postmessage", window.ReactNativeWebView)`))    
    this.webviewRef.injectJavaScript(`
    setMapCenter([45, 39])
    console.log(mapCenter)
    true
    `)
    //webviewRef.postMessage(message)
    //webviewRef.injectJavaScript(window.removeEventListener('message', message => console.log(`message: ${message}`)));
    //console.log("test");
  }

  function onMessage(event) {
    console.log(event.nativeEvent.data);
  }

  let webview = null;

  const allFarmstandsMap = siteUrl

  const addEventListener = `
  console.log("window: ", window)
  console.log("document: ", document)
  window.addEventListener('message', function(event) {console.log("testing onmessage event from injected: ", JSON.stringify(event))})
  window.ReactNativeWebView.postMessage({message: "hello"})
  true
  `

  return(
    <View style={mapScreenStyle.container}>
    <View style={{ width: '100%', height: '100%' }} >
      <WebView
        //originWhitelist={domainUrl}
        originWhitelist={'*'}
        ref={WEB_REF => this.webviewRef = WEB_REF}
        source={{ uri: allFarmstandsMap }}
        onLoad={console.log('loaded allfarmstands.com homepage')}
        javaScriptEnabled={true}
        geolocationEnabled={true}
        injectedJavaScript={addEventListener}
        // injectedJavaScript={
        //   `setMapCenter(${locationCenter})
        //   console.log("locationCenterInjected: ", locationCenter)`
        // }
        //ref={ ref => {
        //  webview = ref;
        //}}
        //onLoadEnd={() => this.webviewRef.postMessage("testing")}
        startInLoadingState={ true }
        onMessage={ event => {
          console.log("onmessage event: ", event)
          // let data = {}
          // try {
          //   data = JSON.parse(event.nativeEvent.data);
          // } catch (e) {
          //   console.log(e);
          // }
      
          // if (data?.event && data.event === 'getCurrentPosition') {
          //   Location.getCurrentPositionAsync((position) => {
          //     webview.postMessage(JSON.stringify({ event: 'currentPosition', data: position }));
          //   }, (error) => {
          //     webview.postMessage(JSON.stringify({ event: 'currentPositionError', data: error }));
          //   }, data.options);
          // } 
        }}
      />
      <View  style={buttonRowStyle.container}>
        <Button style={{width:'25%', margin: 0 }} >Primary</Button>
        <Button color="secondary" style={{width:'25%', margin: 0 }} >Secondary</Button>
        <Button color="warning" style={{width:'25%'}} >Warning</Button>
        <Button 
        color="error" 
        style={{width:'25%'}} 
        onPress={() => sendMessageToWebView() } 
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