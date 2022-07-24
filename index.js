/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import App from './src/App';
import {name as appName} from './app.json';


function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    return null;
  }
  return <App />;
}

ReactNativeForegroundService.register();
AppRegistry.registerComponent(appName, () => HeadlessCheck);
