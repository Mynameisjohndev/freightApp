import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import {
  Container,
  LabelPage,
  SpotContainer,
  SpotButton,
  SpotLabel,
  LabelPrimary,
  LabelSecondary,
  MainContent,
} from './styles';
import { sendInfoDeviceMotoristOpenApp } from '../../configs/send-infodevice';
import { useConnection } from '../../hooks/useNetInfo';
import {
  startForegroundService,
  startForegroundServiceSend,
} from '../../configs/foreground-service';
import { RNDeveloperSettings } from '../../modules/DeveloperSettings';
import { usePermissions } from '../../hooks/usePermissions';

export interface Checkin {
  checkin_at: string;
  checkin_at_formatted: string;
  city: {
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
  };
}

const Home: React.FC = () => {
  const { backgroundLocationPermission, requestBackgroundLocationPermission } =
    usePermissions();
  const netInfo = useConnection();
  const [stateFreight, setStateFreight] = useState('');
  const {
    motorist,
    setMotoristFreights,
    setMotoristInformations,
    firstLogin,
    signOut,
    setFirstLogin,
    loadNotifications,
  } = useAuth();
  const [checkin, setCheckin] = React.useState<Checkin>();
  const navigation = useNavigation();
  const [loadCityCheckin, setLoadCheckin] = useState<boolean>(true);
  const loadMotoristFreightCallback = React.useCallback(async () => {
    const { data: freights } = await api.get('/mobile/freights', {
      params: {
        motorist_id: motorist.id,
      },
    });

    if (freights) {
      if (
        freights.data.length > 0 &&
        freights.data[0].status !== 'finished' &&
        firstLogin
      ) {
        navigation.navigate('MyFreights');
        setFirstLogin(false);
      } else {
        setFirstLogin(false);
      }
    } else {
      setFirstLogin(false);
    }
    if (freights.data && freights.data.length > 0) {
      const activeFreight = freights.data[0];
      setStateFreight(freights.data[0].id);
      startForegroundServiceSend(motorist, activeFreight.id);
      setMotoristFreights(freights);

      if (
        ['collecting', 'ready', 'on_road', 'in_destination'].includes(
          activeFreight.status,
        )
      ) {
        startForegroundService(activeFreight.id);
        const enabled = await RNDeveloperSettings.checkedOptionDevTools();

        if (enabled) {
          signOut();
        }
      }
    }
  }, [
    motorist,
    firstLogin,
    navigation,
    setFirstLogin,
    setMotoristFreights,
    signOut,
  ]);

  React.useEffect(() => {
    loadMotoristFreightCallback();
  }, [loadMotoristFreightCallback]);

  const formatData = (item: Date) => {
    const dataCreatedFormated = format(item, "dd/MM/yyyy 'às' HH:mm");
    return dataCreatedFormated;
  };

  React.useEffect(() => {
    if (backgroundLocationPermission === false) {
      requestBackgroundLocationPermission();
    }
  }, [backgroundLocationPermission, requestBackgroundLocationPermission]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoadCheckin(true);
      const { data } = await api.get<Checkin>(`/mobile/checkin/${motorist.id}`);
      const routes = await api.get(`/motorists/${motorist.id}`);
      const checkinAt = new Date(data.checkin_at);
      const dataRouteCreated = new Date(routes.data.routes[0].updated_at);
      const checkinResponse = {
        ...data,
        checkin_at_formatted: format(checkinAt, "dd/MM/yyyy 'às' HH:mm"),
      };
      if (routes && data) {
        if (dataRouteCreated.getTime() > checkinAt.getTime()) {
          setCheckin({
            checkin_at: routes.data.routes[0].created_at,
            checkin_at_formatted: formatData(dataRouteCreated),
            city: routes.data.routes[0].origin_city,
          });
          setMotoristInformations([
            routes.data.routes[0].origin_city,
            routes.data.routes[0].destination_city,
          ]);
          setLoadCheckin(false);
        } else {
          setMotoristInformations([data.city]);
          setCheckin(checkinResponse);
          setLoadCheckin(false);
        }
      } else if (routes && !data) {
        setCheckin({
          checkin_at: routes.data.routes[0].created_at,
          checkin_at_formatted: formatData(dataRouteCreated),
          city: routes.data.routes[0].origin_city,
        });
        setMotoristInformations([
          routes.data.routes[0].origin_city,
          routes.data.routes[0].destination_city,
        ]);
        setLoadCheckin(false);
      } else if (!routes && data) {
        setMotoristInformations([data.city]);
        setCheckin(checkinResponse);
        setLoadCheckin(false);
      } else {
        setLoadCheckin(false);
      }
      // setCheckin(checkinResponse);
    });

    return unsubscribe;
  }, [motorist.id, navigation, setMotoristInformations]);

  const handleUpdateCheckin = React.useCallback(async () => {
    navigation.navigate('UpdateCheckin');
  }, [navigation]);

  const setOpenAppAndSendInfoDeviceMotoristOpenApp =
    React.useCallback(async (): Promise<void> => {
      await AsyncStorage.setItem(
        '@SpotX:last_open_app_at',
        Date.now().toString(),
      );
    }, []);

  React.useCallback(() => {
    setOpenAppAndSendInfoDeviceMotoristOpenApp();
  }, [setOpenAppAndSendInfoDeviceMotoristOpenApp]);

  React.useEffect(() => {
    sendInfoDeviceMotoristOpenApp(motorist, stateFreight);
  }, [netInfo, motorist, stateFreight]);

  React.useEffect(() => {
    sendInfoDeviceMotoristOpenApp(motorist, stateFreight);
  }, [netInfo, motorist, stateFreight]);

  React.useEffect(() => {
    function loadNotify() {
      loadNotifications(1);
    }
    loadNotify();
  }, [loadNotifications]);

  return (
    <Container>
      <MainContent>
        <LabelPage>
          Insira sua rota e receba alertas de fretes próximos a você
        </LabelPage>

        <SpotContainer>
          <SpotButton
            activeOpacity={0.8}
            style={{ elevation: 10 }}
            onPress={handleUpdateCheckin}
          >
            <Icon name="map-pin" size={56} color="#fff" />
          </SpotButton>
          <SpotLabel>
            {loadCityCheckin === true ? (
              <ActivityIndicator size="large" color="#999" />
            ) : (
              <>
                <LabelPrimary>
                  Ativo em {checkin?.city.name}/{checkin?.city.state.uf}
                </LabelPrimary>
                <LabelSecondary>
                  Desde {checkin?.checkin_at_formatted}
                </LabelSecondary>
              </>
            )}
          </SpotLabel>
        </SpotContainer>
      </MainContent>
    </Container>
  );
};

export default Home;
