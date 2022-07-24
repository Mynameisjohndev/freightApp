import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import LogoDark from '../assets/logo_dark.png';

import Home from '../screens/Home';
import UpdateCheckin from '../screens/UpdateCheckin';

const HomeStack = createStackNavigator();

function HomeStackRoutes(): JSX.Element {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0E3552',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitle: () => (
          <Image source={LogoDark} style={{ width: 110, height: 24 }} />
        ),
      }}
    >
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="UpdateCheckin" component={UpdateCheckin} />
    </HomeStack.Navigator>
  );
}

export default HomeStackRoutes;
