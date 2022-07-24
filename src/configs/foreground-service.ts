/* eslint-disable no-unused-expressions */
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { Alert, PermissionsAndroid, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { sendAllInfoDeviceAboutMotorist } from './send-infodevice';
import { RNLocation } from './location';
import api from '../services/api';
import { RNDeveloperSettings } from '../modules/DeveloperSettings';

export const TASK_ID = 'registerLocationSubscription';

let locationSubscription: { (): void; (): void };
let locationTimeout: NodeJS.Timeout;
let locationObject = '';
let countItemsOfflineArray = 0;
export function startForegroundService(freight_id: string) {
  ReactNativeForegroundService.start({
    id: 1,
    title: 'SpotX',
    message:
      'Você está fazendo um frete SpotX. 🚚\nEstamos acompanhando o seu trajeto!',
  });

  ReactNativeForegroundService.add_task(
    async () => {
      const token = await AsyncStorage.getItem('@SpotX:token');
      const { isConnected } = await NetInfo.fetch();
      const checkFine = await PermissionsAndroid.check(
        'android.permission.ACCESS_FINE_LOCATION',
      );
      const checkBackground = await PermissionsAndroid.check(
        'android.permission.ACCESS_BACKGROUND_LOCATION',
      );

      if (!checkFine || !checkBackground) {
        Alert.alert(
          'Atenção',
          'O aplicativo da SpotX coleta dados de localização para habilitar o monitoramento da viagem realizada pelo motorista durante o frete, mesmo quando o aplicativo está fechado ou não estiver em uso.',
          [
            {
              text: 'Negar',
              style: 'cancel',
            },
            {
              text: 'Aceitar',
              onPress: async () => {
                const granted = await RNLocation.requestPermission({
                  ios: 'whenInUse',
                  android: {
                    detail: 'fine',
                  },
                });
                if (granted) {
                  await PermissionsAndroid.request(
                    'android.permission.ACCESS_BACKGROUND_LOCATION',
                  );
                }
              },
            },
          ],
        );
      }
      // if has permissions try to obtain location with RN location
      if (checkFine) {
        locationSubscription && locationSubscription();
        locationSubscription = RNLocation.subscribeToLocationUpdates(
          async ([locations]) => {
            locationSubscription();
            locationTimeout && clearTimeout(locationTimeout);
            const getDataLocation = {
              latitude: locations.latitude,
              longitude: locations.longitude,
              created_at: new Date(),
            };

            locationObject =
              (await AsyncStorage.getItem('SpotX@locationObject')) || '';

            if (isConnected) {
              if (countItemsOfflineArray > 0) {
                const objLocationObject = JSON.parse(String(locationObject));
                if (objLocationObject) {
                  objLocationObject.map(
                    async (v: {
                      latitude: string;
                      longitude: string;
                      created_at: string;
                    }) => {
                      await api.post(
                        '/mobile/motorists/way-points',
                        {
                          lat: v.latitude,
                          lng: v.longitude,
                          created_at: v.created_at,
                          freight_id,
                        },
                        {
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `bearer ${token}`,
                          },
                        },
                      );
                    },
                  );
                }
                countItemsOfflineArray = 0;
                await AsyncStorage.setItem(
                  'SpotX@locationObject',
                  JSON.stringify([]),
                );
              } else {
                await api.post('/mobile/motorists/way-points', {
                  lat: locations.latitude,
                  lng: locations.longitude,
                  freight_id,
                });
              }
            } else {
              locationObject =
                (await AsyncStorage.getItem('SpotX@locationObject')) || '';

              if (locationObject) {
                const arrLocationObject = JSON.parse(locationObject);
                countItemsOfflineArray = arrLocationObject.length;
                arrLocationObject.push(getDataLocation);
                await AsyncStorage.setItem(
                  'SpotX@locationObject',
                  JSON.stringify(arrLocationObject),
                );
              } else {
                await AsyncStorage.setItem(
                  'SpotX@locationObject',
                  JSON.stringify([]),
                );
              }
            }
          },
        );
      } else {
        locationSubscription && locationSubscription();
        locationTimeout && clearTimeout(locationTimeout);
      }
    },
    {
      delay: 60 * 1000,
      onLoop: true,
      taskId: TASK_ID,
    },
  );
}

export function startForegroundServiceSend(
  motorist: { id: string },
  freight: string,
) {
  ReactNativeForegroundService.add_task(
    async () => {
      return sendAllInfoDeviceAboutMotorist(motorist, freight);
    },
    {
      delay: 60 * 1000,
      onLoop: true,
      taskId: 'registerBackgroundTimerInterval',
    },
  );
}

export function taskCheckDeveloperTools() {
  let sending = false;
  ReactNativeForegroundService.add_task(
    async () => {
      const enabled = await RNDeveloperSettings.checkedOptionDevTools();
      if (enabled) {
        ToastAndroid.show(
          'SpotX: Por favor, abra o nosso app.',
          ToastAndroid.LONG,
        );
        ReactNativeForegroundService.remove_task(
          'registerLocationSubscription',
        );
        if (!sending) {
          ReactNativeForegroundService.update({
            id: 1,
            title: `Atenção!!`,
            message:
              'Você está com o modo do desenvolvedor habilitado.\nDesabilite clicando aqui.',
          });
          sending = true;
        }
      }
    },
    {
      delay: 60 * 1000,
      onLoop: true,
      taskId: 'taskCheckDeveloperTools',
    },
  );
}
