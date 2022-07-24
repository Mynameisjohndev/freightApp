import React from 'react';
import { RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import api from '../../services/api';
import calcDistance from '../../utils/calcDistance';
import {
  Container,
  CardFreight,
  CardHeader,
  PriceLabel,
  CardHeaderDescription,
  TypeItemLabel,
  // VolumeLabel,
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
  ContainerList,
  ContainerFilter,
  TextButtton,
  TextFilter,
  HorizontalText,
  LabelText,
  Row,
  NotificationTitle,
  NotificationDescription,
  ContainerNotification,
  NotificationIcon,
} from './styles';
import { ModalButton } from '../MyFreight/InformProblemModal/styles';
import { useAuth } from '../../hooks/useAuth';
import ModalFilterFreights from './ModalFilterFreights';
import { Option } from '../UpdateCheckin';
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

export interface VehicleProps {
  axes?: number;
  fretebras_vehicle_type_id: number;
  has_trailer: boolean;
  id: string;
  model: string;
  name: string;
  type: string;
}

export interface BodyworkProps {
  fretebras_vehicle_type_id: number;
  id: string;
  name: string;
  type: string;
}

const SearchFreights: React.FC = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [freights, setFreights] = React.useState<Freight[]>([]);
  const { motoristInformations } = useAuth();
  const { navigate } = useNavigation();
  const [origem, setOrigem] = React.useState<Option | null | undefined>();
  const [destiny, setDestiny] = React.useState<Option | null | undefined>();
  const [vehicle, setVehicle] = React.useState<VehicleProps | undefined>();
  const [allVehicles, setAllVehicles] = React.useState<VehicleProps[]>([]);
  const [bodywork, setBodywork] = React.useState<BodyworkProps | undefined>();
  const [allBodyworks, setAllBodyworks] = React.useState<BodyworkProps[]>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const { backgroundLocationPermission, requestBackgroundLocationPermission } =
    usePermissions();

  React.useEffect(() => {
    if (backgroundLocationPermission === false) {
      requestBackgroundLocationPermission();
    }
  }, [backgroundLocationPermission, requestBackgroundLocationPermission]);

  React.useEffect(() => {
    if (motoristInformations[0]) {
      setOrigem({
        label: `${motoristInformations[0].name} - ${motoristInformations[0].state.uf}`,
        value: motoristInformations[0].ibge_id,
      });
    } else {
      setOrigem(null);
    }
    if (motoristInformations[1]) {
      setDestiny({
        label: `${motoristInformations[1].name} - ${motoristInformations[1].state.uf}`,
        value: motoristInformations[1].ibge_id,
      });
    } else {
      setDestiny(null);
    }
  }, [motoristInformations]);

  const validVehicle = (item?: string) => {
    if (item && item !== undefined) {
      return item;
    }
    return null;
  };
  const validBodywork = (item?: string) => {
    if (item && item !== undefined) {
      return item;
    }
    return null;
  };

  const validIbgeId = (item: string | number | undefined) => {
    if (item && item !== undefined) {
      return item;
    }
    return null;
  };

  const loadFreightsCalback = React.useCallback(async () => {
    setRefreshing(true);
    const { data } = await api.get('/mobile/freights', {
      params: {
        status: 'pending',
        order_created_at: 'desc',
        filter_origin_id_ibge_city: validIbgeId(origem?.value),
        filter_detination_id_ibge_city: validIbgeId(destiny?.value),
        filter_vehicle_category: validVehicle(vehicle?.id),
        filter_bodywork: validBodywork(bodywork?.id),
      },
    });
    const dateNow = new Date();
    const formattedData = data.data.map((item: Freight) => {
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

    setFreights(formattedData);
    setRefreshing(false);
  }, [bodywork, destiny, origem, vehicle]);

  const closeModal = () => {
    setOpenModal(!openModal);
  };

  const cleanFilter = () => {
    setOrigem(null);
    setDestiny(null);
    setVehicle(undefined);
    setBodywork(undefined);
  };

  const renderModal = () => {
    if (openModal) {
      return (
        <ModalFilterFreights
          origemCity={origem}
          handleChangeOrigemcity={setOrigem}
          isOpen={openModal}
          onClose={closeModal}
          destinycity={destiny}
          handleChangeDestinycity={setDestiny}
          loadFreights={loadFreightsCalback}
          vehicle={vehicle}
          setVehicle={setVehicle}
          allVehicles={allVehicles}
          bodywork={bodywork}
          setBodywork={setBodywork}
          allBodyworks={allBodyworks}
          cleanFilter={cleanFilter}
        />
      );
    }
    return null;
  };

  React.useEffect(() => {
    loadFreightsCalback();
  }, [loadFreightsCalback]);

  const handleShowFreight = React.useCallback(
    (freight_id: string) => {
      navigate('ShowFreight', { freight_id });
    },
    [navigate],
  );

  const loadVehicles = async () => {
    await api
      .get<VehicleProps[]>('/vehicles/categories/search')
      .then(response => {
        setAllVehicles(response.data);
      })
      .catch(() => null);
  };

  const loadBodyworks = async () => {
    await api
      .get<BodyworkProps[]>('/vehicles/bodies/search')
      .then(response => {
        setAllBodyworks(response.data);
      })
      .catch(() => null);
  };

  React.useEffect(() => {
    loadVehicles();
    loadBodyworks();
  }, []);

  const validFilter = () => {
    if (origem?.label || destiny?.label || vehicle?.name || bodywork?.name) {
      return true;
    }
    return false;
  };

  const validPrice = (item: string) => {
    if (item === null) {
      return 'A combinar';
    }
    if (item === (0.0).toFixed(2)) {
      return 'A combinar';
    }
    return `R$ ${item}`;
  };

  return (
    <Container>
      <ContainerFilter>
        <GestureHandlerRootView>
          <ModalButton color="green" onPress={closeModal}>
            <TextButtton>Buscar fretes</TextButtton>
          </ModalButton>
        </GestureHandlerRootView>
        {validFilter() === true && (
          <>
            <Row />
            <HorizontalText>
              <LabelText>Filtro aplicado:</LabelText>
              {origem?.label && (
                <TextFilter> Origem: {origem?.label};</TextFilter>
              )}
              {destiny?.label && (
                <TextFilter> Destino: {destiny?.label};</TextFilter>
              )}
              {vehicle && <TextFilter> Veículo: {vehicle.name};</TextFilter>}
              {bodywork && (
                <TextFilter> Carroceria: {bodywork.name};</TextFilter>
              )}
            </HorizontalText>
          </>
        )}
      </ContainerFilter>
      {freights.length === 0 ? (
        <ContainerNotification>
          <NotificationIcon name="search" />
          <NotificationTitle>
            Não foram encontrados fretes {'\n'}relacionados no momento.
          </NotificationTitle>
          <NotificationDescription>
            Tente uma combinação diferente nos filtros.
          </NotificationDescription>
        </ContainerNotification>
      ) : (
        <ContainerList
          data={freights}
          keyExtractor={freight => freight.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadFreightsCalback}
            />
          }
          renderItem={({ item }) => (
            <CardFreight onPress={() => handleShowFreight(item.id)}>
              <CardHeader>
                <PriceLabel>{validPrice(item.suggested_price)}</PriceLabel>
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
          ListFooterComponent={() => <ListFooter />}
        />
      )}
      {renderModal()}
    </Container>
  );
};

export default SearchFreights;
