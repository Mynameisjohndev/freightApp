import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import LogoDark from '../assets/logo_dark.png';

import MyFreights from '../screens/MyFreights';
import MyFreight from '../screens/MyFreight';
import MyFreightInfo from '../screens/MyFreightInfo';
import Documents from '../screens/MyFreight/Documents';
import { useAuth } from '../hooks/useAuth';

const MyFreightsStack = createStackNavigator();

function MyFreightsStackRoutes(): JSX.Element {
  const { freightNumber } = useAuth();

  return (
    <MyFreightsStack.Navigator
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
      <MyFreightsStack.Screen
        name="MyFreights"
        component={MyFreights}
        options={{ headerTitle: 'Meus Fretes' }}
      />

      <MyFreightsStack.Screen
        name="MyFreight"
        component={MyFreight}
        options={{ headerTitle: `Meu Frete #${freightNumber}` }}
      />

      <MyFreightsStack.Screen
        name="MyFreightInfo"
        component={MyFreightInfo}
        options={{ headerTitle: 'Informações' }}
      />
      <MyFreightsStack.Screen
        name="Documents"
        component={Documents}
        options={{ headerTitle: 'Documentos' }}
      />
    </MyFreightsStack.Navigator>
  );
}

export default MyFreightsStackRoutes;
