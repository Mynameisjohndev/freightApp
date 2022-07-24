import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '../screens/SignIn';
import CompleteInfo from '../screens/CompleteInfo';

const Auth = createStackNavigator();

function AuthRoutes(): JSX.Element {
  return (
    <Auth.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#ededed' },
      }}
    >
      <Auth.Screen name="SignIn" component={SignIn} />
      <Auth.Screen name="CompleteInfo" component={CompleteInfo} />
    </Auth.Navigator>
  );
}

export default AuthRoutes;
