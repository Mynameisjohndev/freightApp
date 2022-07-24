/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import { useAuth } from '../hooks/useAuth';

import Home from './home.stack';
import MyFreights from './my-freights.stack';
import SearchFreights from './search-freights.stack';
import Notifications from './notification.stack';
import Profile from '../screens/Profile';
import Introduction from '../screens/Introduction';
import CustomTabBar from '../components/CustomTabBar';
import { useConnection } from '../hooks/useNetInfo';

const App = createBottomTabNavigator();
const AppStack = createStackNavigator();

function AppRoutes(): JSX.Element {
  const netInfo = useConnection();
  const { introduction, countNotifications } = useAuth();
  const { motoristFreights, motorist } = useAuth();
  const [hasActiveFreight, setHasActiveFreight] = React.useState(0);
  const [countNotificationState, setCountNotificationState] = React.useState(0);
  React.useEffect(() => {
    if (motoristFreights && motoristFreights[0]?.status !== 'finished') {
      setHasActiveFreight(1);
    } else {
      setHasActiveFreight(0);
    }
  }, [motoristFreights]);

  React.useEffect(() => {
    //
  }, [motoristFreights, motorist, netInfo]);

  const setOpenAppLocalStorage = async () => {
    await AsyncStorage.setItem(
      '@SpotX:last_open_app_at',
      Date.now().toString(),
    );
  };
  React.useEffect(() => {
    setOpenAppLocalStorage();
  });
  React.useEffect(() => {
    setCountNotificationState(countNotifications);
  }, [countNotifications, setCountNotificationState]);
  if (introduction === false) {
    return (
      <AppStack.Navigator initialRouteName="Home">
        <AppStack.Screen
          name="Introduction"
          component={Introduction}
          options={{ headerShown: false }}
        />
      </AppStack.Navigator>
    );
  }
  return (
    <App.Navigator
      initialRouteName="Home"
      tabBar={(props: any) => <CustomTabBar keyboardHidesTabBar {...props} />}
    >
      <App.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <App.Screen
        name="MyFreights"
        component={MyFreights}
        options={{
          tabBarBadge: hasActiveFreight === 1 ? hasActiveFreight : undefined,
          headerShown: false,
        }}
      />
      <App.Screen
        name="SearchFreights"
        component={SearchFreights}
        options={{ headerShown: false }}
      />
      <App.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarBadge:
            countNotificationState >= 1
              ? countNotificationState > 5
                ? '+5'
                : String(countNotificationState)
              : undefined,
          headerShown: false,
        }}
      />
      <App.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </App.Navigator>
  );
}

export default AppRoutes;
