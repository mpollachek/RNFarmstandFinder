import { Text, View, StyleSheet } from "react-native"
import { WebView } from 'react-native-webview'
import { Button } from '@rneui/themed';
import { siteUrl, domainUrl } from '../config'
//import GetLocation from "../components/GetLocation";
import { useState, useRef, useEffect, createRef, useContext } from 'react'
import axios from "axios";
import * as Location from 'expo-location';
import { Camera, CameraType } from "expo-camera";
import { getGeoLocationJS } from "../components/getGeoLocationJS";
import { changeLocation } from "../components/changeLocation";
import {PermissionsAndroid} from 'react-native';
import { UserContext, MapContext, FarmstandsContext, SidebarContext } from "../App";
import { selectAllFarmstands } from "../apiCalls/farmstandFilter"
import { TouchableHighlight } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';


//import { Permission, PERMISSION_TYPE } from "../components/AppPermissions";

//Note to self: Issue is getting location to work.  navigator.geolocation.getCurrentPosition() works on website but not through webview due to "insecure origins" (http not https)
//On RN Location.getCurrentPositionAsync is working but need to pass data to webview
//eventlistener variables logging properly with JSON.stringify(event.data) (injectJavaScript)
// RN button needs to get current location on press and send message to webview (web app)
// RNMap.js in web app needs to take incoming message and setMapCenter.
//for webview console logs: https://developerjesse.com/2021/04/07/console-logs-react-native-webview.html 

const MapScreen = () => {

  const { userId, setUserId, userName, setUserName } = useContext(UserContext);
  const { farmstands, setFarmstands } = useContext(FarmstandsContext);
  const { mapCenter, setMapCenter } = useContext(MapContext)
  const {sidebarProducts, setSidebarProducts, sidebarSeasons, setSidebarSeasons, sidebarSearch, setSidebarSearch, sidebarTypes, setSidebarTypes, sidebarProductSearch, setSidebarProductSearch } = useContext(SidebarContext)

  const webviewRef = useRef();

  const [errorMsg, setErrorMsg] = useState("");
  const [runGet, setRunGet] = useState(false);

  // Need to set bounds distance to map corners like in web app
  const [boundsDistance, setBoundsDistance] = useState(30000);

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
      let currentLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 10000});
      console.log("currentLocation2: ", currentLocation)
      await setMapCenter([
        "locationCtr",
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      ])
      webviewRef.current.postMessage(JSON.stringify(mapCenter))
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access camera was denied');
        console.log("errorMsg:", errorMsg)
        return;
      } else {
        console.log("camera permission granted")
      }
    })();
  }, []);

  /* use effect get farmstands in local map area on page load */
  // useEffect(() => {
  //   let timer = setTimeout(() => {
  //     setRunGet(true);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  // useEffect(() => {
  //   getFarmstands();
  // }, [runGet]);

  /* end use effect get farmstands in local map area on page load */

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
    },
    overlay: {
      bottom: 100,
      right: 40,
      zIndex: 10,
      position: 'absolute',
      backgroundColor: '#FFFFFF'
    }
  })

  // const getFarmstands = async () => {
  //   if (runGet) {
  //     let mapCoords = Object.values(mapCenter)
  //     console.log("sidebarTypes: ", sidebarTypes)
  //     console.log("mapCenter: ", mapCenter)
  //     console.log("mapCenter[0]: ", mapCenter[0])
  //     console.log("mapCenter[1]: ", mapCenter[1])
  //     console.log("mapCenter[2]: ", mapCenter[2])
  //     console.log("mapCoords: ", mapCoords)
  //     console.log("mapCoords[1]: ", mapCoords[1])
  //     const allFarms = await selectAllFarmstands(
  //       mapCoords[1],
  //       mapCoords[2],
  //       boundsDistance,
  //       sidebarProducts,
  //       sidebarProductSearch,
  //       sidebarSeasons,
  //       sidebarTypes
  //     );
  //     if (allFarms) {
  //       let farmsList = ["farmsList"];
  //       allFarms.forEach((f) => {
  //       farmsList.push(f);
  //       });
  //       setFarmstands(farmsList)
  //     } else {
  //       setFarmstands(["farmsList"]);
  //     }
  //     webviewRef.current.postMessage(JSON.stringify(farmstands))
  //     setRunGet(false);
  //   }
  // };

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

      //below works for setting map center but unusable as string for retreiving farmstands from api
      // await setMapCenter(`[
      //   "locationCtr",
      //   ${currentLocation.coords.latitude},
      //   ${currentLocation.coords.longitude}
      // ]`)

      await setMapCenter([
        "locationCtr",
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      ])

      console.log("typeof mapCenter: ", typeof(mapCenter))
      console.log("mapCenter", mapCenter)
      console.log("mapCenter.toString()", mapCenter.toString())
      console.log("webviewRef.current", webviewRef.current)
      webviewRef.current.postMessage(JSON.stringify(mapCenter))
  }

  const searchThisArea = () => {
    let eventMsg = '["searchThisArea"]'
    webviewRef.current.postMessage(eventMsg)
  }

  const returnToMapView = () => {
    let eventMsg = '["mapView"]'
    webviewRef.current.postMessage(eventMsg)
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

  const handleHomePageNavigation = ( e ) => {    

    if (e.nativeEvent) {
      console.log("handleHomePageNavigation", e.nativeEvent.url)
      console.log("domainUrl: ", domainUrl)
      console.log("siteUrl: ", siteUrl)
      const clickedUrl = e.nativeEvent.url;
      console.log("url: ", clickedUrl)

      if ( clickedUrl === domainUrl ) {
        console.log("home site URL clicked")
        let eventMsg = '["mapViewRedirect"]'
        webviewRef.current.postMessage(eventMsg)
        //SEND MSG to redirect to siteURL with reactnativemaps`
        // const redirectTo = 'window.location = "' + `${siteUrl}` + '"'
        // webviewRef.current.injectJavaScript(redirectTo)
        // console.log("redirected to mobile site URL")
      }}
  }

  const allFarmstandsMap = siteUrl

  const addEventListener = `
  console.log("window: ", window)
  console.log("document: ", document)
  document.addEventListener('message', function(event) {console.log("testing onmessage event from injected: ", JSON.stringify(event.data))})
  document.ReactNativeWebView.postMessage({message: "hello"})
  true
  `

  const onMessageHandler = (event) => {
    console.log("onmessage event: ", event)
    console.log("onmessage event.data: ", event.nativeEvent.data)
    if (event.nativeEvent.data === "changeLocation") {
      console.log("setWebviewCenter from onMessage")
      setWebviewCenter()
    }
  }

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
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode={"compatibility"}
        onMessage={onMessageHandler}
        //onNavigationStateChange={handleHomePageNavigation}
        onLoadProgress={handleHomePageNavigation}
      />
      {/* <View  style={buttonRowStyle.container}>
        <Button style={{width:'25%', margin: 0 }} >Primary</Button>
        <Button 
        color="secondary" 
        style={{width:'25%', margin: 0 }} 
        onPress={searchThisArea}
        >Secondary</Button>
        <Button 
        color="warning" 
        style={{width:'25%'}} 
        onPress={searchThisArea} 
        >Warning</Button>
        <Button 
        color="error" 
        style={{width:'25%'}} 
        onPress={setWebviewCenter}
        >Error</Button>
      </View> */}
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
      {/* <View style={buttonRowStyle.overlay}>
        <MaterialIcons.Button 
        name="location-searching" 
        size={48} 
        color="black" 
        onPress={() => setWebviewCenter()}
        />
        </View> */}
        {/* webview location button not working after navigating */}
        {/* create button overlay to return to map page. if rerendering webview it should fix location button issue */}      
      {/* <View style={buttonRowStyle.overlay}>
        <MaterialIcons.Button 
        name="location-searching" 
        size={48} 
        color="black" 
        onPress={() => returnToMapView()}
        />
      </View> */}
    </View>
    </View>
  )
}



export default MapScreen