import React, { useState } from 'react';
import { ActivityIndicator, Linking, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
// eslint-disable-next-line import/no-duplicates
import { format, formatDistance } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import ptBR from 'date-fns/locale/pt-BR';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { lineString, LineString, Feature, Properties } from '@turf/helpers';
import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';

import {
  Container,
  InfoContainer,
  CardFreight,
  CardHeader,
  PriceLabel,
  CardBody,
  Origin,
  OriginIcon,
  OriginLabel,
  DistanceLabel,
  Destination,
  DestinationIcon,
  DestinationLabel,
  Distance,
  CardDescription,
  Row,
  Col,
  Label,
  Value,
  Contact,
  ContactLabel,
  SocialButton,
  IconContainer,
  IconButton,
  LabelButton,
} from './styles';
import api from '../../services/api';
import calcDistance from '../../utils/calcDistance';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../hooks/useAuth';

const accessToken =
  'pk.eyJ1Ijoic3BvdHhiciIsImEiOiJja245NWI3YXUwY2Y1MnZtbDYydDl4czUyIn0.7IKY-f6QO-6rNfUedTpcww';

const directionsClient = MapboxDirectionsFactory({ accessToken });

interface RouteParams {
  freight_id: string;
}

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

interface Coordinates {
  origin: number[];
  destination: number[];
}

interface RouteMetrics {
  duration: string;
  distance: string;
}

const ShowFreight: React.FC = () => {
  const { params } = useRoute();
  const { setFreightNumberSearched } = useAuth();
  const routeParams = params as RouteParams;

  const [freight, setFreight] = React.useState<Freight>();
  const [direction, setDirection] =
    React.useState<Feature<LineString, Properties>>();
  const [coords, setCoords] = React.useState<Coordinates>();
  const [routeMetrics, setRouteMetrics] = React.useState<RouteMetrics>();
  const { backgroundLocationPermission, requestBackgroundLocationPermission } =
    usePermissions();
  const [creatorNumber, setCreatoruNmber] = useState<string>('');

  React.useEffect(() => {
    if (backgroundLocationPermission === false) {
      requestBackgroundLocationPermission();
    }
  }, [backgroundLocationPermission, requestBackgroundLocationPermission]);

  React.useEffect(() => {
    const loadFreight = async () => {
      const { data } = await api.get(
        `/mobile/freights/${routeParams.freight_id}`,
      );
      setFreightNumberSearched(data.freight_number);
      setCreatoruNmber(data.creator.phone);
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
      };

      setFreight(formattedData);
      setCoords({
        origin: [+origin.lng, +origin.lat],
        destination: [+destination.lng, +destination.lat],
      });
    };

    loadFreight();
  }, [routeParams.freight_id, setFreightNumberSearched]);

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

        const { distance } = res.body.routes[0];
        const duration = res.body.routes[0].duration as number;

        const formattedDuration = formatDistance(0, duration * 1000, {
          includeSeconds: true,
          locale: ptBR,
        });

        setRouteMetrics({
          distance: `${Math.round(distance / 1000)} Km`,
          duration: `${formattedDuration}`,
        });
      };
      fetchRoute();
    }
  }, [coords]);

  const sendWhatsapp = React.useCallback(() => {
    Linking.openURL(`whatsapp://send?phone=+55${creatorNumber}`);
  }, [creatorNumber]);

  const makePhoneCall = React.useCallback(() => {
    Linking.openURL(`tel:${creatorNumber}`);
  }, [creatorNumber]);

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
        <MapboxGL.PointAnnotation
          id="originPointAnnotation"
          title={freight.origin.name}
          coordinate={[+freight.origin.lng, +freight.origin.lat]}
          anchor={{ x: 0.5, y: 1 }}
        >
          <OriginIcon name="map-pin" size={20} />
        </MapboxGL.PointAnnotation>
        <MapboxGL.PointAnnotation
          id="destinationPointAnnotation"
          title={freight.destination.name}
          coordinate={[+freight.destination.lng, +freight.destination.lat]}
        >
          <DestinationIcon name="circle" size={20} />
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
      <InfoContainer>
        <CardFreight>
          <CardHeader>
            <PriceLabel>R$ {freight?.suggested_price}</PriceLabel>
          </CardHeader>

          <CardBody>
            <Origin>
              <OriginIcon name="circle" />
              <OriginLabel>
                {freight.origin.name} - {freight.origin.state.uf}
              </OriginLabel>
            </Origin>

            <Distance>
              <DistanceLabel>
                Distância real: {routeMetrics?.distance}
              </DistanceLabel>
              <DistanceLabel>
                Duração: {routeMetrics?.duration} dirigindo
              </DistanceLabel>
            </Distance>

            <Destination>
              <DestinationIcon name="map-pin" />
              <DestinationLabel>
                {freight.destination.name} - {freight.destination.state.uf}
              </DestinationLabel>
            </Destination>
          </CardBody>

          <CardDescription>
            <Row>
              <Col>
                <Label>Veículos: </Label>
                <Value>{freight.vehicles}</Value>
              </Col>
            </Row>
            <Row>
              <Col>
                <Label>Carrocerias: </Label>
                <Value>{freight.bodies}</Value>
              </Col>
            </Row>
            <Row>
              <Col>
                <Label>Espécie: </Label>
                <Value>{freight.item.category.name}</Value>
              </Col>
              <Col>
                <Label>Produtos: </Label>
                <Value>{freight.item.name}</Value>
              </Col>
            </Row>
            <Row>
              <Col>
                <Label>Rastreador: </Label>
                <Value>{freight.item.require_tracker ? 'Sim' : 'Não'}</Value>
              </Col>
              <Col>
                <Label>Complemento: </Label>
                <Value>{freight.item.has_complement ? 'Sim' : 'Não'}</Value>
              </Col>
            </Row>
            {freight.item.weight && (
              <Row>
                <Col>
                  <Label>Peso: </Label>
                  <Value>{freight.item.weight}</Value>
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <Label>Cadastrado em: </Label>
                <Value>{freight.created_at_formatted}</Value>
              </Col>
            </Row>
            <Row>
              <Col>
                <Label>Preço: </Label>
                <Value>R$ {freight.suggested_price}</Value>
              </Col>
            </Row>
          </CardDescription>
        </CardFreight>

        <Contact>
          <ContactLabel>Interessado?</ContactLabel>

          <Row style={{ marginTop: 16 }}>
            <SocialButton onPress={sendWhatsapp}>
              <IconContainer style={{ backgroundColor: '#0C9D58' }}>
                <IconButton name="message-circle" />
              </IconContainer>
              <LabelButton>WhatsApp</LabelButton>
            </SocialButton>

            <SocialButton onPress={makePhoneCall}>
              <IconContainer style={{ backgroundColor: '#FF772A' }}>
                <IconButton name="phone" />
              </IconContainer>
              <LabelButton>Chamar</LabelButton>
            </SocialButton>
          </Row>
        </Contact>
      </InfoContainer>
    </Container>
  ) : (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#999" />
    </View>
  );
};

export default ShowFreight;
