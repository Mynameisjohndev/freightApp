import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import api from '../services/api';

// DEVICES INFOS
let historyJsonInfoDevice = {};
export async function sendAllInfoDeviceAboutMotorist(
  motorist: { id: string },
  freight: string,
) {
  const token = await AsyncStorage.getItem('@SpotX:token');
  const grantedPermissionLocation = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  const dateLastOffiline = await AsyncStorage.getItem(
    '@SpotX:netinfo_app_offline',
  );
  const grantedPermissionCamera = await DeviceInfo.isCameraPresent();
  const getAvailableLocationProviders =
    await DeviceInfo.getAvailableLocationProviders();
  const batteryLevel = (await DeviceInfo.getPowerState()).batteryLevel?.toFixed(
    2,
  );
  const { batteryState } = await DeviceInfo.getPowerState();
  const { isInternetReachable, isConnected, type } = await NetInfo.fetch();
  const getSystemVersion = DeviceInfo.getSystemVersion();
  const getAppVersion = DeviceInfo.getReadableVersion();
  const getSystemName = DeviceInfo.getSystemName();
  const getModel = DeviceInfo.getModel();
  const getCarrier = await DeviceInfo.getCarrier();
  const getApiLevel = await DeviceInfo.getApiLevel();
  const getBrand = DeviceInfo.getBrand();
  const getDeviceId = DeviceInfo.getDeviceId();
  const getLastUpdateTime = await DeviceInfo.getLastUpdateTime();

  if (freight) {
    const jsonInfoDevice = {
      motorist_id: motorist.id,
      freight_id: freight,
      status_gps: getAvailableLocationProviders.gps || false,
      battery_level: Math.ceil(Number(batteryLevel) * 100),
      battery_state: batteryState || 'unplugged',
      has_connection: isConnected || false,
      is_wifi_enabled: isInternetReachable || false,
      type_connection: type || 'cellular',
      permission_location: grantedPermissionLocation || false,
      permission_camera: grantedPermissionCamera || false,
      date_last_offline: dateLastOffiline || undefined,
      system_version: getSystemVersion || undefined,
      app_version: getAppVersion || undefined,
      system_name: getSystemName || undefined,
      device_model: getModel || undefined,
      carrier: getCarrier || undefined,
      system_api_level: Number(getApiLevel) || undefined,
      device_brand: getBrand || undefined,
      system_device_id: getDeviceId || undefined,
      system_last_update_time: new Date(getLastUpdateTime) || undefined,
    };
    const isRepetitionInfoDevice =
      JSON.stringify(jsonInfoDevice) === historyJsonInfoDevice;
    historyJsonInfoDevice = JSON.stringify(jsonInfoDevice);
    if (!isConnected) {
      await AsyncStorage.setItem(
        '@SpotX:netinfo_app_offline',
        Date.now().toString(),
      );
    } else if (!isRepetitionInfoDevice) {
      await api.post('/motorists/device-infos', jsonInfoDevice, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
      });
      await api.put(
        `/freights/${freight}`,
        { has_monitoring: !!freight },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          },
        },
      );
    }
  }
}
//  DEVICES INFOS

// APP INFOS
export async function sendInfoDeviceMotoristOpenApp(
  motorist: { id: string },
  freight?: string,
) {
  const token = await AsyncStorage.getItem('@SpotX:token');
  const dateOpenAppAt =
    (await AsyncStorage.getItem('@SpotX:last_open_app_at')) || undefined;
  const dateOpenMyFreightAt =
    (await AsyncStorage.getItem('@SpotX:last_open_my_freight_at')) || undefined;

  const jsonInfoDevice = {
    motorist_id: motorist.id,
    freight_id: freight || undefined,
    first_install_at: (await DeviceInfo.getFirstInstallTime()) || undefined,
    last_open_app_at: dateOpenAppAt,
    last_open_my_freight_at: dateOpenMyFreightAt,
  };
  await api.post('/motorists/app-infos', jsonInfoDevice, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`,
    },
  });
}
