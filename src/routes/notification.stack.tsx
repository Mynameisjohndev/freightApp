import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import LogoDark from '../assets/logo_dark.png';

import Notification from '../screens/Notifications';

const NotificationStack = createStackNavigator();

function NotificationStackRoutes(): JSX.Element {
  return (
    <NotificationStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0E3552',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'left',
        headerRight: () => (
          <Image
            source={LogoDark}
            style={{ width: 110, height: 24, marginRight: 12 }}
          />
        ),
      }}
    >
      <NotificationStack.Screen
        name="Notification"
        component={Notification}
        options={{ headerTitle: 'Notificações' }}
      />
    </NotificationStack.Navigator>
  );
}

export default NotificationStackRoutes;
