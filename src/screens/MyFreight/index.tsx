import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { lineString, LineString, Feature, Properties } from '@turf/helpers';
import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';
import calcDistance from '../../utils/calcDistance';
import { useAuth } from '../../hooks/useAuth';
import {
  Container,
  MapPinIcon,
  FreightStatusContainer,
  InformProblemBtn,
  InformProblemText,
  ContainerMoreInformation,
  MoreInformation,
  IconInfo,
  MapIcon,
  RowButton,
} from './styles';
import { InformStatusModal } from './InformStatusModal';
import { InformProblemModal } from './InformProblemModal';
import FreightStatusItem from './FreightStatusItem';
import { sendInfoDeviceMotoristOpenApp } from '../../configs/send-infodevice';

const accessToken =
  'pk.eyJ1Ijoic3BvdHhiciIsImEiOiJja245NWI3YXUwY2Y1MnZtbDYydDl4czUyIn0.7IKY-f6QO-6rNfUedTpcww';

const directionsClient = MapboxDirectionsFactory({ accessToken });

export interface RouteParams {
  freight_id: string;
  status: string;
}

export interface City {
  name: string;
  lat: number;
  lng: number;
  state: {
    name: string;
    uf: string;
  };
}
interface Location {
  x: number;
  y: number;
}

interface Coords {
  lat?: number;
  lng?: number;
}

export interface Freight {
  origin_coords?: Location;
  destination_coords?: Location;
  formatted_origin_coords?: Coords;
  formatted_destination_coords?: Coords;
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
    require_tracker: boolean;
    weight?: number;
    has_complement: boolean;
    category: {
      name: string;
    };
  };
  vehicle_categories: {
    name: string;
  }[];
  vehicle_bodies: {
    name: string;
  }[];
  vehicles: string;
  bodies: string;
}

interface FreightStatusHistory {
  id: string;
  status: string;
  disabled_reason: string;
  description: string;
  freight_id: string;
  motorist_id: string;
  origin: string;
  created_at: string;
  updated_at: string;
  get_coords_freight_status: Location;
}

interface Coordinates {
  origin: number[];
  destination: number[];
}

export interface RouteMetrics {
  duration: string;
  distance: string;
}

const freightStatusIndexes = {
  in_origin: 1,
  collecting: 2,
  ready: 3,
  on_road: 4,
  in_destination: 5,
  delivered: 6,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const MyFreight: React.FC = () => {
  const { motorist, motoristFreights, setFreightNumber } = useAuth();
  const { params } = useRoute();
  const navigation = useNavigation();
  const routeParams = params as RouteParams;
  // const [currentPosition, setCurrentPosition] = React.useState<{
  //   latitude: number;
  //   longitude: number;
  const [freight, setFreight] = React.useState<Freight>();
  // }>();
  const [direction, setDirection] =
    React.useState<Feature<LineString, Properties>>();
  const [coords, setCoords] = React.useState<Coordinates>();
  const [deliveredCoords, setDeliveredCoords] = React.useState<
    FreightStatusHistory | undefined
  >();
  const [goToCollectingCoords, setGoToCollectingCoords] = React.useState<
    FreightStatusHistory | undefined
  >();
  const [collectingCoords, setCollectingCoords] = React.useState<
    FreightStatusHistory | undefined
  >();
  const [informStatusModalIsOpen, setInformStatusModalIsOpen] =
    React.useState(false);
  const [informProblemModalIsOpen, setInformProblemModalIsOpen] =
    React.useState(false);
  const [freightStatus, setFreightStatus] = React.useState('');
  const [freightStatusHistory, setFreightStatusHistory] = React.useState<
    FreightStatusHistory[]
  >([]);
  const [freightID] = useState(routeParams.freight_id);

  const loadFreight = React.useCallback(async () => {
    const { data } = await api.get(
      `/mobile/freights/${routeParams.freight_id}`,
    );
    setFreightNumber(data.freight_number);
    const createdAt = new Date(data.created_at);
    const { origin, destination } = data;
    const formattedData = {
      ...data,
      created_at_formatted: format(createdAt, "dd/MM/yyyy 'às' HH:mm"),
      distance: calcDistance(
        { lat: origin.lat, lng: origin.lng },
        { lat: destination.lat, lng: destination.lng },
      ),
      vehicles: data.vehicle_categories
        .map((f: { name: string }) => f.name)
        .join(', '),
      bodies: data.vehicle_bodies
        .map((f: { name: string }) => f.name)
        .join(', '),
      formatted_origin_coords: data.origin_coords
        ? {
            lat: data?.origin_coords?.x,
            lng: data?.origin_coords?.y,
          }
        : undefined,
      formatted_destination_coords: data.destination_coords
        ? {
            lat: data?.destination_coords?.x,
            lng: data?.destination_coords?.y,
          }
        : undefined,
    };

    setFreight(formattedData);
    setCoords({
      origin: [+origin.lng, +origin.lat],
      destination: [+destination.lng, +destination.lat],
    });
  }, [routeParams.freight_id, setFreightNumber]);

  const loadFreightStatusHistory = React.useCallback(async () => {
    const { data } = await api.get<FreightStatusHistory[]>(
      `/freights/freights-status-history/freight/${routeParams.freight_id}`,
    );
    const collectingDestination = data
      .filter(
        item => item.status === 'collecting' && item.get_coords_freight_status,
      )
      .find(history => history.status === 'collecting');
    if (collectingDestination?.get_coords_freight_status)
      setCollectingCoords(collectingDestination);
    const goToColectingCoords = data
      .filter(item => item.status === 'ready' && item.get_coords_freight_status)
      .find(history => history.status === 'ready');
    if (goToColectingCoords?.get_coords_freight_status)
      setGoToCollectingCoords(goToColectingCoords);
    const deliveredNewCoords = data
      .filter(
        item => item.status === 'delivered' && item.get_coords_freight_status,
      )
      .find(history => history.status === 'delivered');

    if (deliveredNewCoords?.get_coords_freight_status)
      setDeliveredCoords(deliveredNewCoords);
    setFreightStatusHistory(
      data.map(history => ({
        ...history,
        created_at: format(
          new Date(history.created_at),
          "dd/MM/yyyy 'às' HH:mm",
        ),
      })),
    );
    await AsyncStorage.setItem(
      '@SpotX:last_open_my_freight_at',
      Date.now().toString(),
    );
  }, [routeParams.freight_id]);

  React.useEffect(() => {
    loadFreight();
    loadFreightStatusHistory();
  }, [loadFreight, loadFreightStatusHistory]);

  React.useEffect(() => {
    if (coords) {
      const fetchRoute = async () => {
        const res = await directionsClient
          .getDirections({
            waypoints: [
              { coordinates: coords.origin },
              { coordinates: coords.destination },
            ],
            profile: 'driving',
            geometries: 'geojson',
          })
          .send();
        const newRoute = lineString(res.body.routes[0].geometry.coordinates);
        setDirection(newRoute);

        // const { distance } = res.body.routes[0];
        // const duration = res.body.routes[0].duration as number;

        // const formattedDuration = formatDistance(0, duration * 1000, {
        //   includeSeconds: true,
        //   locale: ptBR,
        // });
      };
      fetchRoute();
    }
  }, [coords, navigation]);
  const setLastOpenMyFreightAtCallBack = React.useCallback(() => {
    async function setLastOpenMyFreightAt() {
      await AsyncStorage.setItem(
        '@SpotX:last_open_my_freight_at',
        Date.now().toString(),
      );
      sendInfoDeviceMotoristOpenApp(motorist, freight?.id);
    }
    return setLastOpenMyFreightAt();
  }, [motorist, freight]);
  React.useEffect(() => {
    //
  }, [setLastOpenMyFreightAtCallBack, motoristFreights]);

  const handleNavigatToMoreDetails = () => {
    navigation.navigate('MyFreightInfo', { freight });
  };
  const handleNavigatToDocuments = () => {
    navigation.navigate('Documents', { freightID });
  };

  return freight ? (
    <Container>
      <MapboxGL.MapView
        style={{ width: '100%', height: 220 }}
        styleURL={MapboxGL.StyleURL.Outdoors}
        rotateEnabled={false}
        logoEnabled={false}
      >
        <MapboxGL.Camera
          bounds={{
            ne: [+freight.origin.lng, +freight.origin.lat],
            sw: [+freight.destination.lng, +freight.destination.lat],
            paddingTop: 50,
            paddingRight: 50,
            paddingBottom: 50,
            paddingLeft: 50,
          }}
          animationMode="flyTo"
          animationDuration={1000}
        />

        {/* {currentPosition && (
          <MapboxGL.PointAnnotation
            id="currentPositionAnnotation"
            title="Minha posição"
            coordinate={[currentPosition.longitude, currentPosition.latitude]}
            anchor={{ x: 0.5, y: 1 }}
          >
            <MapPinIcon name="truck" size={20} color="#0e3552" />
          </MapboxGL.PointAnnotation>
        )} */}

        <MapboxGL.PointAnnotation
          id="originPointAnnotation"
          title={freight.origin.name}
          coordinate={[+freight.origin.lng, +freight.origin.lat]}
          anchor={{ x: 0.5, y: 1 }}
        >
          <MapPinIcon name="map-pin" size={20} color="#0e3552" />
        </MapboxGL.PointAnnotation>

        {collectingCoords?.get_coords_freight_status.x && (
          <MapboxGL.PointAnnotation
            id="originPointAnnotation"
            title={collectingCoords.status}
            coordinate={[
              collectingCoords.get_coords_freight_status.y,
              collectingCoords.get_coords_freight_status.x,
            ]}
            anchor={{ x: 0.5, y: 1 }}
          >
            <MapIcon name="dolly" size={20} color="#ff772a" />
          </MapboxGL.PointAnnotation>
        )}

        {goToCollectingCoords?.get_coords_freight_status.x && (
          <MapboxGL.PointAnnotation
            id="originPointAnnotation"
            title={goToCollectingCoords.status}
            coordinate={[
              goToCollectingCoords.get_coords_freight_status.y,
              goToCollectingCoords.get_coords_freight_status.x,
            ]}
            anchor={{ x: 0.5, y: 1 }}
          >
            <MapIcon name="running" size={20} color="#ff772a" />
          </MapboxGL.PointAnnotation>
        )}

        {deliveredCoords?.get_coords_freight_status.x && (
          <MapboxGL.PointAnnotation
            id="originPointAnnotation"
            title={deliveredCoords.status}
            coordinate={[
              deliveredCoords.get_coords_freight_status.y,
              deliveredCoords.get_coords_freight_status.x,
            ]}
            anchor={{ x: 0.5, y: 1 }}
          >
            <MapIcon name="truck-loading" size={20} color="#ff772a" />
          </MapboxGL.PointAnnotation>
        )}

        <MapboxGL.PointAnnotation
          id="destinationPointAnnotation"
          title={freight.destination.name}
          coordinate={[+freight.destination.lng, +freight.destination.lat]}
        >
          <MapPinIcon name="circle" size={20} color="#ff772a" />
        </MapboxGL.PointAnnotation>

        {direction && (
          <MapboxGL.ShapeSource id="shape-source" shape={direction}>
            <MapboxGL.LineLayer
              id="line-layer"
              style={{ lineWidth: 3, lineJoin: 'round', lineColor: '#0e3552' }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>

      <RowButton>
        <ContainerMoreInformation
          style={{ backgroundColor: '#0e3552' }}
          onPress={handleNavigatToMoreDetails}
        >
          <IconInfo name="arrow-up-circle-sharp" color="#ffffff" />
          <MoreInformation>Mais detalhes</MoreInformation>
        </ContainerMoreInformation>
        <ContainerMoreInformation
          style={{ backgroundColor: '#ff772a' }}
          onPress={handleNavigatToDocuments}
        >
          <IconInfo name="documents-outline" color="#ffffff" />
          <MoreInformation>Documentos</MoreInformation>
        </ContainerMoreInformation>
      </RowButton>

      <FreightStatusContainer>
        <FreightStatusItem
          title="Ir para coleta"
          active={freight.status === 'in_origin'}
          situation={
            freightStatusIndexes[freight.status] > 0 ? 'success' : 'pending'
          }
          onAction={() => {
            setInformStatusModalIsOpen(true);
            setFreightStatus('collecting');
            loadFreightStatusHistory();
          }}
          description={
            freightStatusHistory.find(
              history => history.status === 'collecting',
            )?.created_at
          }
        />

        <FreightStatusItem
          title="Cheguei para carregar"
          active={freight.status === 'collecting'}
          situation={
            freightStatusIndexes[freight.status] > 1 ? 'success' : 'pending'
          }
          onAction={() => {
            setInformStatusModalIsOpen(true);
            setFreightStatus('ready');
            loadFreightStatusHistory();
          }}
          description={
            freightStatusHistory.find(history => history.status === 'ready')
              ?.created_at
          }
        />

        <FreightStatusItem
          title="Começar a viagem"
          active={freight.status === 'ready'}
          situation={
            freightStatusIndexes[freight.status] > 2 ? 'success' : 'pending'
          }
          onAction={() => {
            setInformStatusModalIsOpen(true);
            setFreightStatus('on_road');
            loadFreightStatusHistory();
          }}
          description={
            freightStatusHistory.find(history => history.status === 'on_road')
              ?.created_at
          }
        />

        <FreightStatusItem
          title="Cheguei para descarregar"
          active={freight.status === 'on_road'}
          situation={
            freightStatusIndexes[freight.status] > 3 ? 'success' : 'pending'
          }
          onAction={() => {
            setInformStatusModalIsOpen(true);
            setFreightStatus('in_destination');
            loadFreightStatusHistory();
          }}
          description={
            freightStatusHistory.find(
              history => history.status === 'in_destination',
            )?.created_at
          }
        />

        <FreightStatusItem
          title="Terminei de descarregar"
          active={freight.status === 'in_destination'}
          situation={
            freightStatusIndexes[freight.status] > 4 ? 'success' : 'pending'
          }
          onAction={() => {
            setInformStatusModalIsOpen(true);
            setFreightStatus('delivered');
            loadFreightStatusHistory();
          }}
          description={
            freightStatusHistory.find(history => history.status === 'delivered')
              ?.created_at
          }
        />

        {/* <FreightStatusItem
          title="Finalizar serviço"
          active={freight.status === 'delivered'}
          situation={
            freightStatusIndexes[freight.status] > 5 ? 'success' : 'pending'
          }
        /> */}
      </FreightStatusContainer>

      <InformProblemBtn onPress={() => setInformProblemModalIsOpen(true)}>
        <InformProblemText>Tive um problema</InformProblemText>
      </InformProblemBtn>

      <InformStatusModal
        freight_id={routeParams.freight_id}
        status={freight.status}
        statusFreight={freightStatus}
        isOpen={informStatusModalIsOpen}
        onClose={() => {
          setInformStatusModalIsOpen(false);
          loadFreight();
        }}
      />

      <InformProblemModal
        isOpen={informProblemModalIsOpen}
        onClose={() => setInformProblemModalIsOpen(false)}
        status={routeParams.status}
        freight_id={routeParams.freight_id}
      />
    </Container>
  ) : (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#999" />
    </View>
  );
};

export default MyFreight;
