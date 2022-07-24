import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useAuth } from '../hooks/useAuth';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

function Routes(): JSX.Element {
  const { motorist, loading, setIntroduction } = useAuth();

  React.useEffect(() => {
    async function getIntroApp() {
      const intro = await AsyncStorage.getItem('INTRO-APP');
      if (intro) {
        setIntroduction(true);
      } else {
        setIntroduction(false);
      }
    }
    getIntroApp();
  }, [setIntroduction]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return motorist ? <AppRoutes /> : <AuthRoutes />;
}

export default Routes;
