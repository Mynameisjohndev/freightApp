import React, { Dispatch, SetStateAction } from 'react';
import { Modal } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FormHandles } from '@unform/core';
import api from '../../../services/api';
import { City, Option } from '../../UpdateCheckin';
import { Form, InputGroup } from '../../UpdateCheckin/styles';
import { TextButtton } from '../styles';
import {
  Container,
  ModalCloseIcon,
  ModalContent,
  ModalHeader,
  ModalHeaderCloseButton,
  ModalTitle,
  ModalFooter,
  Label,
  ModalButton,
  CancelModalButton,
  ModalCancelButtonText,
  InputSelect,
  InputSelectText,
  Clean,
  CleanIcon,
} from './styles';
import { BodyworkProps, VehicleProps } from '..';
import ModalSelectVehicle from './ModalSelectVehicle';
import ModalSelectBodywork from './ModalSelectBodywork';
import ModalSelectCity from './ModalSelectCity';
// import { Freight } from '../../MyFreights';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  origemCity?: Option | null;
  destinycity?: Option | null;
  handleChangeOrigemcity?: Dispatch<SetStateAction<Option | null | undefined>>;
  handleChangeDestinycity?: Dispatch<SetStateAction<Option | null | undefined>>;
  loadFreights: () => Promise<void>;
  setVehicle: Dispatch<SetStateAction<VehicleProps | undefined>>;
  vehicle?: VehicleProps | undefined;
  allVehicles: VehicleProps[];
  setBodywork: Dispatch<SetStateAction<BodyworkProps | undefined>>;
  bodywork?: BodyworkProps | undefined;
  allBodyworks: BodyworkProps[];
  cleanFilter: () => void;
}

export function ModalFilterFreights({
  isOpen = false,
  onClose,
  origemCity,
  destinycity,
  handleChangeOrigemcity,
  handleChangeDestinycity,
  loadFreights,
  setVehicle,
  vehicle,
  allVehicles,
  setBodywork,
  bodywork,
  allBodyworks,
  cleanFilter,
}: ModalProps): JSX.Element {
  const [cities, setCities] = React.useState<Option[]>([]);
  const [openOption, setOpenOptions] = React.useState<boolean>(false);
  const [openBodyworksOption, setOpenBodyworksOptions] =
    React.useState<boolean>(false);
  const [openOrigemOptions, setOpenOrigemOptions] =
    React.useState<boolean>(false);
  const [openDestinyOptions, setOpenDestinyOptions] =
    React.useState<boolean>(false);

  const formRef = React.useRef<FormHandles>(null);
  const handleSearchCities = React.useCallback(async (str: string) => {
    if (str.length < 3) return;

    const { data } = await api.get<City[]>('/cities/search', {
      params: {
        name: str,
      },
    });

    const citiesOptions = data.map(item => ({
      label: `${item.name} - ${item.state.uf}`,
      value: item.ibge_id,
    }));

    setCities(citiesOptions);
  }, []);

  const searchAndCloseModal = () => {
    onClose();
    loadFreights();
  };

  const openAndCloseOptions = () => {
    setOpenOptions(!openOption);
  };

  const openAndCloseBodyworks = () => {
    setOpenBodyworksOptions(!openBodyworksOption);
  };

  const openAndCloseOrigem = () => {
    setOpenOrigemOptions(!openOrigemOptions);
  };

  const openAndCloseDestiny = () => {
    setOpenDestinyOptions(!openDestinyOptions);
  };

  const renderModalBodywork = () => {
    if (openBodyworksOption) {
      return (
        <ModalSelectBodywork
          closeOption={openAndCloseBodyworks}
          options={allBodyworks}
          setSelected={setBodywork}
        />
      );
    }
    return null;
  };

  const renderModalVehicle = () => {
    if (openOption) {
      return (
        <ModalSelectVehicle
          closeOption={openAndCloseOptions}
          openOption={openOption}
          options={allVehicles}
          setSelected={setVehicle}
          selected={vehicle}
        />
      );
    }
    return null;
  };

  const renderModalOrigem = () => {
    if (openOrigemOptions) {
      return (
        <ModalSelectCity
          closeOption={openAndCloseOrigem}
          options={cities}
          handleChangeOrigemcity={handleChangeOrigemcity}
          onChangeCity={handleSearchCities}
        />
      );
    }
    return null;
  };

  const renderModalDestiny = () => {
    if (openDestinyOptions) {
      return (
        <ModalSelectCity
          closeOption={openAndCloseDestiny}
          options={cities}
          handleChangeOrigemcity={handleChangeDestinycity}
          onChangeCity={handleSearchCities}
        />
      );
    }
    return null;
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <Container>
        <ModalContent>
          <ModalHeader>
            <ModalHeaderCloseButton onPress={onClose}>
              <ModalCloseIcon name="x" />
            </ModalHeaderCloseButton>
            <ModalTitle>Filtrar fretes</ModalTitle>
          </ModalHeader>
          <CancelModalButton
            style={{ marginTop: 10 }}
            onPress={() => cleanFilter()}
          >
            <ModalCancelButtonText>Limpar filtros</ModalCancelButtonText>
          </CancelModalButton>
          <Form ref={formRef} onSubmit={() => null}>
            <InputGroup>
              <Label>Cidade de origem</Label>
              <InputSelect onPress={() => openAndCloseOrigem()}>
                <InputSelectText>
                  {!origemCity ? 'Selecione uma cidade' : origemCity.label}
                </InputSelectText>
                <Clean onPress={() => handleChangeOrigemcity(undefined)}>
                  <CleanIcon color="#919191" name="x" />
                </Clean>
              </InputSelect>
              <Label>Cidade de destino</Label>
              <InputSelect onPress={() => openAndCloseDestiny()}>
                <InputSelectText>
                  {!destinycity ? 'Selecione uma cidade' : destinycity.label}
                </InputSelectText>
                <Clean onPress={() => handleChangeDestinycity(undefined)}>
                  <CleanIcon color="#919191" name="x" />
                </Clean>
              </InputSelect>
              <Label>Veículo</Label>
              <InputSelect onPress={() => openAndCloseOptions()}>
                <InputSelectText>
                  {!vehicle ? 'Selecione um veículo' : vehicle.name}
                </InputSelectText>
                <Clean onPress={() => setVehicle(undefined)}>
                  <CleanIcon color="#919191" name="x" />
                </Clean>
              </InputSelect>
              <Label>Carroceria</Label>
              <InputSelect onPress={() => openAndCloseBodyworks()}>
                <InputSelectText>
                  {!bodywork ? 'Selecione uma carroceria' : bodywork.name}
                </InputSelectText>
                <Clean onPress={() => setBodywork(undefined)}>
                  <CleanIcon color="#919191" name="x" />
                </Clean>
              </InputSelect>
            </InputGroup>
          </Form>
          <ModalFooter>
            <GestureHandlerRootView>
              <ModalButton color="green" onPress={searchAndCloseModal}>
                <TextButtton>Buscar</TextButtton>
              </ModalButton>
            </GestureHandlerRootView>
          </ModalFooter>
        </ModalContent>
      </Container>
      {renderModalVehicle()}
      {renderModalBodywork()}
      {renderModalOrigem()}
      {renderModalDestiny()}
    </Modal>
  );
}

export default ModalFilterFreights;
