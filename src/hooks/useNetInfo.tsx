/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';

export type NetInfoState = {
  type: string;
  isConnected: boolean;
  isInternetReachable: boolean;
  details: any;
};

const inititalState: NetInfoState = {
  type: NetInfoStateType.unknown,
  isConnected: false,
  isInternetReachable: false,
  details: {},
};
export const useConnection = (): NetInfoState => {
  const [netInfo, setNetInfo] = useState(inititalState);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onChange(newState: any) {
    setNetInfo(newState);
    if (!newState.isConnected) {
      await AsyncStorage.setItem(
        '@SpotX:netinfo_app_offline',
        Date.now().toString(),
      );
    }
  }

  useEffect(() => {
    NetInfo.fetch().then(onChange);
    const unsubscribe = NetInfo.addEventListener(onChange);

    return unsubscribe;
  }, []);

  return netInfo;
};
