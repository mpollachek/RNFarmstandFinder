import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  ToastAndroid
} from 'react-native';
  import Constants from 'expo-constants';
  import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import { Icon } from '@rneui/themed';
import { getFocusedRouteNameFromRoute } from '@react-navigation/core';
import NetInfo from '@react-native-community/netinfo';
import MapScreen from "./MapScreen"

const Main = () => {
  console.log("started main")

  const Drawer = createDrawerNavigator();

  const screenOptions = {
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: '#5637DD' }
  }

  const MapNavigator = () => {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name='Map'
          component={mapScreen}
          options={({ navigation }) => ({
            title: 'Map',
            headerLeft: () => (
              <Icon
                name='map-location-dot'
                type='font-awesome-5'
                onPress={() => console.log("testing")}
              />
            )
          })}
        />
      </Stack.Navigator>
    )
  }

  return(
    <View>
      <MapScreen />
    </View>
  )}

export default Main