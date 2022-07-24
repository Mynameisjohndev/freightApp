/* eslint-disable no-unused-expressions */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
/* eslint-disable no-unused-vars */
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Alert, AppState, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import notifee, { EventType } from '@notifee/react-native';
import { Freight } from '../screens/MyFreights';
import api from '../services/api';
import { RNPushNotification } from './useNotification';
import navigate from '../services/RouteNavigation';
import { RNDeveloperSettings } from '../modules/DeveloperSettings';
import {
  startForegroundService,
  taskCheckDeveloperTools,
} from '../configs/foreground-service';

interface Motorist {
  id: string;
  name: string;
  phone: string;
}

interface AuthState {
  token: string;
  motorist: Motorist;
}

interface SignInCredentials {
  phone: string;
}

export interface NotificationInterface {
  total: SetStateAction<number>;
  data: any;
  body?: string;
  created_at?: string;
  id?: string;
  motorist_id?: string;
  read?: boolean;
  title?: string;
  type?: string;
  updated_at?: string;
  user_id?: string;
  per_page?: number;
  page?: number;
}
export interface routes {
  ibge_id: number;
  is_capital: boolean;
  lat: string;
  lng: string;
  name: string;
  state: {
    ibge_id: number;
    lat: string;
    lng: string;
    name: string;
    uf: string;
  };
  state_ibge_id: number;
}

interface ContextData {
  motorist: Motorist;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  signIn: (data: SignInCredentials) => Promise<void>;
  signOut(): Promise<void>;
  // eslint-disable-next-line no-unused-vars
  loadMotoristFreights: (motorist_id: string) => Promise<Freight[]>;
  loadNotifications: (
    page: number,
    per_page?: number,
  ) => Promise<NotificationInterface>;
  setViewerNotifications: () => Promise<void>;
  motoristFreights?: Freight[];
  setMotoristFreights: Dispatch<SetStateAction<Freight[] | undefined>>;
  setMotoristInformations: Dispatch<SetStateAction<routes[]>>;
  motoristInformations: routes[];
  setFirstLogin: Dispatch<SetStateAction<boolean>>;
  firstLogin: boolean;
  checkDevToolsEnable: () => Promise<void>;
  setIntroduction: Dispatch<SetStateAction<boolean>>;
  introduction: boolean;
  totalNotifications: number;
  countNotifications: number;
  notificationsData: NotificationInterface;
  setFreightNumber: Dispatch<SetStateAction<number>>;
  freightNumber: number;
  setFreightNumberSearched: Dispatch<SetStateAction<number>>;
  freightNumberSearched: number;
}

const AuthContext = createContext<ContextData>({} as ContextData);

const AuthProvider: React.FC = ({ children }) => {
  const appState = React.useRef(AppState.currentState);
  const [datas, setDatas] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);
  const [motoristFreights, setMotoristFreights] = useState<Freight[]>();
  const [notificationsData, setNotificationsData] = React.useState([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [countNotifications, setCountNotifications] = useState(0);
  const [motoristInformations, setMotoristInformations] = React.useState<
    routes[]
  >([]);
  const [firstLogin, setFirstLogin] = useState<boolean>(false);
  const [sendAlertState, setSendAlertState] = useState<boolean>(false);
  const [introduction, setIntroduction] = useState<boolean>(false);
  const [freightNumber, setFreightNumber] = useState<number>(0);
  const [freightNumberSearched, setFreightNumberSearched] = useState<number>(0);

  async function loadMotoristFreights(motorist_id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return api
      .get('/mobile/freights', {
        params: { motorist_id },
      })
      .then(({ data }) => {
        return data.data;
      })
      .catch(() => {
        //
      });
  }

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, motorist] = await AsyncStorage.multiGet([
        '@SpotX:token',
        '@SpotX:motorist',
      ]);

      if (token[1] && motorist[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;

        setDatas({
          token: token[1],
          motorist: JSON.parse(motorist[1]),
        });
      }

      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const fcmToken = await messaging().getToken();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      // console.log('Authorization status:', authStatus);
    }
    // console.log(fcmToken);
    await AsyncStorage.setItem('fcmToken', fcmToken);
  }

  const signIn = useCallback(async ({ phone }) => {
    await requestUserPermission();
    const tokenFcm = await AsyncStorage.getItem('fcmToken');
    const response = await api.post('mobile/sessions', { phone, tokenFcm });
    const { token, motorist } = response.data;

    await AsyncStorage.multiSet([
      ['@SpotX:token', token],
      ['@SpotX:motorist', JSON.stringify(motorist)],
      ['@SpotX:last_open_app_at', Date.now().toString()],
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;

    setDatas({ motorist, token });
    setFirstLogin(true);
  }, []);

  const signOut = useCallback(async () => {
    RNPushNotification.cancelAllNotifications();
    messaging().deleteToken();
    await AsyncStorage.multiRemove(['@SpotX:token', '@SpotX:motorist']);
    ReactNativeForegroundService.remove_task('registerLocationSubscription');
    ReactNativeForegroundService.remove_task('registerBackgroundTimerInterval');
    ReactNativeForegroundService.remove_task('taskCheckDeveloperTools');
    ReactNativeForegroundService.stop();
    setDatas({} as AuthState);
    setMotoristFreights([]);
    setFirstLogin(false);
    setIntroduction(true);
  }, []);

  // async function baterryOtimization() {
  //   const batteryOptimizationEnabled =
  //     await notifee.isBatteryOptimizationEnabled();
  //   if (batteryOptimizationEnabled) {
  //     // 2. ask your users to disable the feature
  //     Alert.alert(
  //       'Restrições detectadas',
  //       'Para garantir que as notificações sejam entregues, desative a otimização da bateria do aplicativo.\n\nApós as configurações serem abertas, siga os passos abaixo:\n\n 1º Procure por uma opção de "Aplicativos não otimizados", clique em cima e selecione "Todos";\n\n2º Em seguida procure por um icone de LUPA, clique em cima e digite SPOTX;\n\n3º Em seguida desative e volte ao app.',
  //       [
  //         // 3. launch intent to navigate the user to the appropriate screen
  //         {
  //           text: 'OK, abrir as configurações',
  //           onPress: async () =>
  //             await notifee.openBatteryOptimizationSettings(),
  //         },
  //         {
  //           text: 'Cancelar',
  //           onPress: () => console.log('Cancel Pressed'),
  //           style: 'cancel',
  //         },
  //       ],
  //       { cancelable: false },
  //     );
  //   }
  // }
  function checkDontViewed(item: { read: boolean }) {
    if (!item.read) {
      return item;
    }
  }

  const loadNotifications = useCallback(
    async (
      pageNext: number,
      per_page?: number,
    ): Promise<NotificationInterface | void> => {
      const motoristString = await AsyncStorage.getItem('@SpotX:motorist');
      const motorist = JSON.parse(String(motoristString));

      return api
        .get('/notifications/push-notification/list', {
          params: {
            motorist_id: motorist.id,
            per_page,
            page: pageNext,
          },
        })
        .then(({ data }) => {
          setNotificationsData(data);
          setTotalNotifications(data.total);
          const result = data.data.filter(checkDontViewed);
          if (result) {
            setCountNotifications(result.length);
          }
          return Object.assign(data);
        })
        .catch(() => {
          ToastAndroid.show(
            'Não foi possível carregar sua lista de notificações! :(',
            ToastAndroid.LONG,
          );
          // console.error('Error: ', error.message);
        });
    },
    [],
  );

  const setViewerNotifications = React.useCallback(async (): Promise<void> => {
    const motoristString = await AsyncStorage.getItem('@SpotX:motorist');
    const motorist = JSON.parse(String(motoristString));
    return api
      .put('/mobile/notification/read', {
        motorist_id: motorist.id,
        read_all: true,
      })
      .then(() => setCountNotifications(0))
      .catch(err => {
        ToastAndroid.show(String(err.message), ToastAndroid.LONG);
      });
  }, []);

  const onNotify = React.useCallback(async () => {
    // baterryOtimization();
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      const motoristString = await AsyncStorage.getItem('@SpotX:motorist');
      const motorist = JSON.parse(String(motoristString));
      const motoristId = motorist.id;
      const freight = await loadMotoristFreights(motoristId);
      const freightId = freight[0].id;

      if (motorist) {
        if (Boolean(remoteMessage?.data?.active_monitoring) === true) {
          if (freightId) {
            startForegroundService(freightId);
          }
        }
        // } else {
        //   remoteMessage.notification &&
        //     (await RNPushNotification.displayPushNotification(remoteMessage));
        // }
      }
    });

    const unsubscribeForeground = messaging().onMessage(async message => {
      const motoristString = await AsyncStorage.getItem('@SpotX:motorist');
      const motorist = JSON.parse(String(motoristString));

      if (motorist) {
        if (message.notification) {
          await RNPushNotification.displayPushNotification(message);
          loadNotifications(1, 15);
        }
      }
    });

    return {
      unsubscribeForeground,
      loadNotifications,
    };
  }, [loadNotifications]);

  React.useEffect(() => {
    const onForegroundEvent = notifee.onForegroundEvent(({ type }) => {
      if (type === EventType.PRESS) {
        navigate('Notifications');
      }
    });

    return () => {
      onForegroundEvent();
    };
  }, []);

  React.useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(() => {
      navigate('Notifications');
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          navigate('Notifications');
        }
      });
  }, []);

  useEffect(() => {
    onNotify();
  }, [onNotify]);

  const checkDevToolsEnable = useCallback(async () => {
    taskCheckDeveloperTools();
    const checkEnable = await RNDeveloperSettings.checkedOptionDevTools();
    if (checkEnable && !sendAlertState) {
      Alert.alert(
        'Atenção',
        'De acordo com a política do nosso app. \n\nPor favor, desative as Opções do Desenvolvedor e acesse novamente.',
        [
          {
            text: 'Certo!',
            style: 'default',
            onPress: async () => {
              ReactNativeForegroundService.remove_task(
                'registerLocationSubscription',
              );
              ReactNativeForegroundService.remove_task(
                'registerBackgroundTimerInterval',
              );
              ReactNativeForegroundService.remove_task(
                'taskCheckDeveloperTools',
              );
              ReactNativeForegroundService.stop();
              await RNDeveloperSettings.sendMotoristToSettingDeveloperOptions();
            },
          },
        ],
      );
      signOut();
      setSendAlertState(true);
    }
  }, [sendAlertState, signOut]);

  React.useEffect(() => {
    checkDevToolsEnable();

    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          setSendAlertState(false);
          checkDevToolsEnable();
        }
        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [appState, checkDevToolsEnable]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        motorist: datas.motorist,
        loading,
        loadMotoristFreights,
        loadNotifications,
        notificationsData,
        countNotifications,
        setViewerNotifications,
        totalNotifications,
        motoristFreights,
        setMotoristFreights,
        setMotoristInformations,
        motoristInformations,
        firstLogin,
        checkDevToolsEnable,
        setFirstLogin,
        introduction,
        setIntroduction,
        freightNumber,
        setFreightNumber,
        freightNumberSearched,
        setFreightNumberSearched,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): ContextData {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
}

export { AuthProvider, useAuth };
