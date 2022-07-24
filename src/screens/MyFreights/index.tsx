/* eslint-disable no-await-in-loop */
import React from 'react';
import { Alert, PermissionsAndroid, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LocationEnabler from 'react-native-location-enabler';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';
import calcDistance from '../../utils/calcDistance';

import {
  Container,
  CardFreight,
  CardHeader,
  PriceLabel,
  CardHeaderDescription,
  TypeItemLabel,
  CardBody,
  Origin,
  OriginIcon,
  OriginLabel,
  DistanceLabel,
  Destination,
  DestinationIcon,
  DestinationLabel,
  CardFooter,
  TimeLabel,
  PublishedAtLabel,
  Distance,
  ListFooter,
  ListFreightHeader,
  ListFreightHeaderText,
  NoFreights,
  NoFreightsMessage,
  NoFreigthsIcon,
} from './styles';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { usePermissions } from '../../hooks/usePermissions';

interface City {
  name: string;
  lat: number;
  lng: number;
  state: {
    name: string;
    uf: string;
  };
}

export interface Freight {
  id: string;
  status: string;
  suggested_price: string;
  suggested_price_type: string;
  created_at: string;
  created_at_formatted: string;
  origin: City;
  destination: City;
  distance: number;
  has_toll: boolean;
  item: {
    name: string;
    category: {
      name: string;
    };
  };
}

const { useLocationSettings } = LocationEnabler;

const MyFreights: React.FC = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [freights, setFreights] = React.useState<Freight[]>([]);
  const { navigate } = useNavigation();
  const { motorist } = useAuth();
  const [locationEnabled, requestResolution] = useLocationSettings({
    alwaysShow: true,
  });
  const { backgroundLocationPermission, requestBackgroundLocationPermission } =
    usePermissions();

  React.useEffect(() => {
    if (backgroundLocationPermission === false) {
      requestBackgroundLocationPermission();
    }
  }, [backgroundLocationPermission, requestBackgroundLocationPermission]);

  const loadMyFreightsCallback = React.useCallback(async () => {
    setRefreshing(true);
    const dateNow = new Date();
    const { data: motoristFreights } = await api.get('/mobile/freights', {
      params: {
        motorist_id: motorist.id,
      },
    });

    if (motoristFreights) {
      const formattedData = motoristFreights.data.map((item: Freight) => {
        const { origin, destination } = item;
        const createdAt = new Date(item.created_at);
        const diffMinutes = differenceInMinutes(dateNow, createdAt);
        const diffHours = differenceInHours(dateNow, createdAt);
        const diffDays = differenceInDays(dateNow, createdAt);
        let diff = `${diffMinutes} min`;

        if (diffMinutes > 60) {
          diff = `${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        }

        if (diffHours > 24) {
          diff = `${diffDays} dia${diffDays > 1 ? 's' : ''}`;
        }

        return {
          ...item,
          distance: calcDistance(
            { lat: origin.lat, lng: origin.lng },
            { lat: destination.lat, lng: destination.lng },
          ),
          created_at_formatted: `Há ${diff}`,
        };
      });
      if (formattedData) {
        setFreights(formattedData);
      }
    }
    setRefreshing(false);
  }, [motorist.id]);

  React.useEffect(() => {
    loadMyFreightsCallback();
  }, [loadMyFreightsCallback]);

  // const handleMyFreight = React.useCallback(
  async function handleMyFreight(freight_id: string, status: string) {
    if (!locationEnabled) {
      requestResolution();
    }
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
              let permissions = await PermissionsAndroid.requestMultiple([
                'android.permission.ACCESS_FINE_LOCATION',
                'android.permission.ACCESS_BACKGROUND_LOCATION',
              ]);
              let fineGranted =
                permissions['android.permission.ACCESS_FINE_LOCATION'];
              let backgroundGranted =
                permissions['android.permission.ACCESS_BACKGROUND_LOCATION'];

              while (
                fineGranted !== 'granted' ||
                backgroundGranted !== 'granted'
              ) {
                permissions = await PermissionsAndroid.requestMultiple([
                  'android.permission.ACCESS_FINE_LOCATION',
                  'android.permission.ACCESS_BACKGROUND_LOCATION',
                ]);
                fineGranted =
                  permissions['android.permission.ACCESS_FINE_LOCATION'];
                backgroundGranted =
                  permissions['android.permission.ACCESS_BACKGROUND_LOCATION'];
              }
              navigate('MyFreight', { freight_id, status });
            },
          },
        ],
      );
    }

    if (checkFine) {
      navigate('MyFreight', { freight_id, status });
    }
  }

  return freights.length >= 0 ? (
    <Container
      data={freights}
      keyExtractor={(freight: { id: string }) => freight.id}
      refreshControl={<RefreshControl refreshing={refreshing} />}
      ListHeaderComponent={() => (
        <ListFreightHeader>
          <ListFreightHeaderText>Meus fretes na SpotX</ListFreightHeaderText>
        </ListFreightHeader>
      )}
      renderItem={({ item }) => (
        <CardFreight
          onPress={() => {
            handleMyFreight(item.id, item.status);
          }}
          isDisabled={item.status === 'finished'}
        >
          <CardHeader>
            <PriceLabel>R$ {item.suggested_price}</PriceLabel>
            <CardHeaderDescription>
              <TypeItemLabel>
                {item.item.category.name} / {item.item.name}
              </TypeItemLabel>
              {/* <VolumeLabel>Lotação: 9.000Kg</VolumeLabel> */}
            </CardHeaderDescription>
          </CardHeader>

          <CardBody>
            <Origin>
              <OriginIcon name="circle" />
              <OriginLabel>
                {item.origin.name} - {item.origin.state.uf}
              </OriginLabel>
            </Origin>

            <Distance>
              <DistanceLabel>{item.distance} Km</DistanceLabel>
            </Distance>

            <Destination>
              <DestinationIcon name="map-pin" />
              <DestinationLabel>
                {item.destination.name} - {item.destination.state.uf}
              </DestinationLabel>
            </Destination>
          </CardBody>

          <CardFooter>
            <TimeLabel>
              Inclui pedágio: {item.has_toll ? 'Sim' : 'Não'}
            </TimeLabel>
            <PublishedAtLabel>{item.created_at_formatted}</PublishedAtLabel>
          </CardFooter>
        </CardFreight>
      )}
      ListFooterComponent={<ListFooter />}
    />
  ) : (
    <NoFreights>
      <NoFreigthsIcon name="alert-circle" />
      <NoFreightsMessage>
        Não tenho nenhum frete com a SpotX ainda
      </NoFreightsMessage>
    </NoFreights>
  );
};

export default MyFreights;
