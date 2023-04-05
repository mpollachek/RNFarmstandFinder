import 'react-native-gesture-handler';
import Main from "./screens/MainComponent";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  console.log("started app")
  return(
    <NavigationContainer>
      <Main />
    </NavigationContainer>
  )
}