import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  Layout,
  Text,
} from "@ui-kitten/components";
import Dashboard from "../screens/Dashboard";
import Notes from "../screens/Notes";
import Reminders from "../screens/Reminders";
import Settings from "../screens/Settings";
import Login from "../screens/AuthScreen/Login";
import { SessionContext } from "../context";

const TabNavigator = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    style={{ height: 75, backgroundColor: "#CDCDCD" }}
    // indicatorStyle={{ color: "red", backgroundColor: "red", height: 100 }}
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab
      style={{ backgroundColor: "red", color: "white" }}
      icon={(props) => <Icon {...props} fill="#8F9BB3" name="grid-outline" />}
    />
    <BottomNavigationTab
      icon={(props) => (
        <Icon {...props} fill="#8F9BB3" name="file-text-outline" />
      )}
    />
    <BottomNavigationTab
      icon={(props) => <Icon {...props} fill="#8F9BB3" name="bulb-outline" />}
    />
    <BottomNavigationTab
      icon={(props) => (
        <Icon {...props} fill="#8F9BB3" name="settings-outline" />
      )}
    />
  </BottomNavigation>
);

const InternalPages = () => (
  <TabNavigator.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
    <TabNavigator.Screen name="Dashboard" component={Dashboard} />
    <TabNavigator.Screen name="Notes" component={Notes} />
    <TabNavigator.Screen name="Reminders" component={Reminders} />
    <TabNavigator.Screen name="Settings" component={Settings} />
  </TabNavigator.Navigator>
);

const ExternalPages = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={Login} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { session } = useContext(SessionContext);
  return (
    <NavigationContainer>
      {session?.token ? <InternalPages /> : <ExternalPages />}
    </NavigationContainer>
  );
};

export default AppNavigator;