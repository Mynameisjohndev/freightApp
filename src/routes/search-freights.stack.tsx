import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import LogoDark from '../assets/logo_dark.png';

import SearchFreights from '../screens/SearchFreights';
import ShowFreight from '../screens/ShowFreight';
import { useAuth } from '../hooks/useAuth';

const SearchFreightsStack = createStackNavigator();

function SearchFreightsStackRoutes(): JSX.Element {
  const { freightNumberSearched } = useAuth();

  return (
    <SearchFreightsStack.Navigator
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
      <SearchFreightsStack.Screen
        name="SearchFreights"
        component={SearchFreights}
        options={{ headerTitle: 'Fretes' }}
      />

      <SearchFreightsStack.Screen
        name="ShowFreight"
        component={ShowFreight}
        options={{ headerTitle: `Frete #${freightNumberSearched} ` }}
      />
    </SearchFreightsStack.Navigator>
  );
}

export default SearchFreightsStackRoutes;
