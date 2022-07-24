import 'react-native-gesture-handler';
import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Routes from './routes';
import AppProvider from './hooks';
import { navigationRef } from './services/RouteNavigation';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

MapboxGL.setAccessToken(
  'pk.eyJ1Ijoic3BvdHhiciIsImEiOiJja245NWI3YXUwY2Y1MnZtbDYydDl4czUyIn0.7IKY-f6QO-6rNfUedTpcww',
);
MapboxGL.setTelemetryEnabled(false);

const App: React.FC = () => {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar barStyle="light-content" backgroundColor="#0E3552" />
      <AppProvider>
        <Routes />
      </AppProvider>
    </NavigationContainer>
  );
};

export default App;
