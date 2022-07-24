import React from 'react';
import { Alert, Linking, TouchableOpacity } from 'react-native';
import * as Yup from 'yup';

import { FormHandles } from '@unform/core';

import DeviceInfo from 'react-native-device-info';
import logoDark from '../../assets/logo_dark.png';
import Button from '../../components/Button';
import InputMask from '../../components/InputMask';
import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  Header,
  ImageLogo,
  CardMain,
  LabelText,
  Footer,
  InfoApplication,
  TermsText,
  TermsTextPrivacyPolicy,
} from './styles';
import { useAuth } from '../../hooks/useAuth';
import { useConnection } from '../../hooks/useNetInfo';

const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const formRef = React.useRef<FormHandles>(null);
  const systemVersion = DeviceInfo.getSystemVersion();
  const netInfo = useConnection();
  const readableVersion = DeviceInfo.getReadableVersion();
  const handleAgree = React.useCallback(
    async data => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          phone: Yup.string().required('Telefone obrigatório'),
        });

        await schema.validate(data, { abortEarly: false });

        await signIn({ phone: data.phone });

        // navigate('CompleteInfo');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert(
          'Erro na Autenticação',
          'O motorista não está cadastrado em nossa base de dados',
        );
      }
    },
    [signIn],
  );

  return (
    <Container>
      <Header>
        <ImageLogo source={logoDark} />
      </Header>

      <CardMain ref={formRef} onSubmit={handleAgree}>
        <LabelText>Digite o número do seu celular com DDD</LabelText>
        <InputMask
          type="custom"
          options={{
            mask: '(99) 9 9999-9999',
          }}
          name="phone"
          icon="phone"
          keyboardType="numeric"
          placeholder="Telefone"
        />
      </CardMain>

      <InfoApplication>
        S {readableVersion} | A {systemVersion} | W{' '}
        {netInfo.isConnected === true ? 'On' : 'Off'}
      </InfoApplication>
      <Footer>
        <TermsText>
          Ao continuar você concorda com nossa{' '}
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                'https://spotx.com.br/politica-de-privacidade.php',
              );
            }}
          >
            <TermsTextPrivacyPolicy>
              Políticas de Privacidade.
            </TermsTextPrivacyPolicy>
          </TouchableOpacity>
        </TermsText>
        <Button color="secondary" onPress={() => formRef.current?.submitForm()}>
          Concordar e continuar
        </Button>
      </Footer>
    </Container>
  );
};

export default SignIn;
