import React from 'react';
import { Alert, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import { FormHandles } from '@unform/core';

import Autocomplete from '../../components/Autocomplete';
import Button from '../../components/Button';
import api from '../../services/api';

import { Container, LabelPage, Form, InputGroup } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';

export interface City {
  ibge_id: number;
  name: string;
  state: {
    name: string;
    uf: string;
  };
}

export interface Option {
  label: string;
  value: string | number;
}

interface SubmitFormData {
  origin_city: Option;
  destination_city?: Option;
}

const UpdateCheckin: React.FC = () => {
  const { motorist } = useAuth();
  const { navigate } = useNavigation();
  const formRef = React.useRef<FormHandles>(null);
  const [cities, setCities] = React.useState<Option[]>([]);
  const { backgroundLocationPermission, requestBackgroundLocationPermission } =
    usePermissions();

  React.useEffect(() => {
    if (backgroundLocationPermission === false) {
      requestBackgroundLocationPermission();
    }
  }, [backgroundLocationPermission, requestBackgroundLocationPermission]);

  const handleUpdateCheckin = React.useCallback(
    async (data: SubmitFormData) => {
      try {
        formRef.current?.setErrors({});

        const grantedPermission = await PermissionsAndroid.check(
          'android.permission.ACCESS_FINE_LOCATION',
        );

        const schema = Yup.object().shape({
          origin_city: Yup.object()
            .shape({
              label: Yup.string().required('Campo obrigatório'),
              value: Yup.number().required('Escolha uma das opções'),
            })
            .required('Campo obrigatório'),
          destination_city: Yup.object().shape({
            label: Yup.string(),
            value: Yup.number(),
          }),
        });

        await schema.validate(data, { abortEarly: false });

        if (!grantedPermission) {
          return Alert.alert(
            'Erro ao salvar o checkin',
            'Não foi possível salvar o checkin',
          );
        }
        if (data.destination_city) {
          await api.post('/mobile/routes', {
            origin_id: data.origin_city.value,
            destination_id: data.destination_city.value,
            motorist_id: motorist.id,
          });
        } else {
          await api.post('/mobile/checkin', {
            checkin_at: new Date(),
            city_id: data.origin_city.value,
            motorist_id: motorist.id,
          });
        }
        navigate('Home');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return err;
        }

        Alert.alert(
          'Erro ao salvar o checkin',
          'Não foi possível salvar o checkin',
        );
      }
      return false;
    },
    [motorist.id, navigate],
  );

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

  return (
    <Container>
      <LabelPage>
        Insira sua rota e receba alertas de fretes próximos a você
      </LabelPage>

      <Form ref={formRef} onSubmit={handleUpdateCheckin}>
        <InputGroup>
          <Autocomplete
            name="origin_city"
            icon="map-pin"
            placeholder="Checkin"
            options={cities}
            onChangeText={handleSearchCities}
          />
          <Autocomplete
            name="destination_city"
            icon="map-pin"
            placeholder="Cidade destino"
            options={cities}
            onChangeText={handleSearchCities}
          />
        </InputGroup>
        <Button color="primary" onPress={() => formRef.current?.submitForm()}>
          Salvar checkin
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateCheckin;
