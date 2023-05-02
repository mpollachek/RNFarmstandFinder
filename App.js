import 'react-native-gesture-handler';
import Main from "./screens/MainComponent";
import { NavigationContainer } from "@react-navigation/native";
import { useState, createContext } from "react";

export const UserContext = createContext();
export const FarmstandsContext = createContext();
export const MapContext = createContext();
export const SingleFarmstandContext = createContext();
export const CommentsContext = createContext();
export const SidebarContext = createContext();

export default function App() {

  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userOwned, setUserOwned] = useState([])

  const [farmstands, setFarmstands] = useState([]); //all farmstands in view

  const [farmstand, setFarmstand] = useState({ products: [], images: [], comments: [], owner: [], ownercomments: [], farmstandType: [], seasons: [], location: {coordinates: []} });  // 1 farmstand by farmstand id

    // sidebar states:
    const [sidebarProducts, setSidebarProducts] = useState([]);
    const [sidebarSeasons, setSidebarSeasons] = useState("yearRound");
    const [sidebarSearch, setSidebarSearch] = useState("");
    const [sidebarTypes, setSidebarTypes] = useState([]);
    const [sidebarProductSearch, setSidebarProductSearch] = useState("all")

  const [comments, setComments] = useState([
    {
      commentId: "",
      rating: "",
      text: "",
      author: "",
      date: "2000-08-04T20:11Z",
      updated: "",
    },
  ]);

  const [mapCenter, setMapCenter] = useState(["locationCtr", 51.505, -0.09]);

  return(
    <NavigationContainer>
      <UserContext.Provider value={{userId, setUserId, userName, setUserName, userOwned, setUserOwned, userEmail, setUserEmail}}> 
      <FarmstandsContext.Provider value={{farmstands, setFarmstands}}>
      <SingleFarmstandContext.Provider value={{farmstand, setFarmstand}}>
      <CommentsContext.Provider value={{comments, setComments}}>
      <SidebarContext.Provider value={{sidebarProducts, setSidebarProducts, sidebarSeasons, setSidebarSeasons, sidebarSearch, setSidebarSearch, sidebarTypes, setSidebarTypes, sidebarProductSearch, setSidebarProductSearch }}>
      <MapContext.Provider value={{mapCenter, setMapCenter}}>
      <Main />
      </MapContext.Provider>
      </SidebarContext.Provider>
      </CommentsContext.Provider>
      </SingleFarmstandContext.Provider>
      </FarmstandsContext.Provider>
      </UserContext.Provider>
    </NavigationContainer>
  )
}