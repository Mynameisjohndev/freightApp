import React from 'react';

import { FormHandles } from '@unform/core';
import Button from '../../components/Button';
import Autocomplete from '../../components/Autocomplete';

import logoLight from '../../assets/logo_light.png';

import {
  Container,
  Header,
  ImageLogo,
  MainSection,
  LabelText,
  Form,
  InputGroup,
} from './styles';

const CompleteInfo: React.FC = () => {
  const formRef = React.useRef<FormHandles>(null);

  const handleCompleteInfo = React.useCallback(() => {
    //
  }, []);

  return (
    <Container>
      <Header style={{ elevation: 5 }}>
        <ImageLogo source={logoLight} />
      </Header>

      <MainSection>
        <LabelText>Informe o tipo do seu veículo</LabelText>
        <Form ref={formRef} onSubmit={handleCompleteInfo}>
          <InputGroup>
            <Autocomplete
              name="vehicle_category"
              icon="truck"
              placeholder="Tipo de veículo"
              options={[
                { label: 'Carreta', value: 'pvlima' },
                { label: 'Carreta LS', value: 'pvlima' },
                { label: 'Truck', value: 'pvlima' },
                { label: 'Bitruck', value: 'pvlima' },
                { label: 'Fiorino', value: 'pvlima' },
              ]}
            />
            <Autocomplete
              name="vehicle_body"
              icon="truck"
              placeholder="Carroceria"
              options={[
                { label: 'Baú', value: 'pvlima' },
                { label: 'Grade Baixa', value: 'pvlima' },
                { label: 'Graneleiro', value: 'pvlima' },
                { label: 'Apenas Cavalo', value: 'pvlima' },
                { label: 'Grade Alta', value: 'pvlima' },
              ]}
            />
          </InputGroup>
          <Button
            color="primary"
            onPress={() => {
              formRef.current?.submitForm();
            }}
          >
            Salvar
          </Button>
        </Form>
      </MainSection>
    </Container>
  );
};

export default CompleteInfo;
