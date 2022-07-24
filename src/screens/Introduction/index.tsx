import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import Slider from 'react-native-app-intro-slider';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../assets/Introduction.png';
import {
  Container,
  ContainerImage,
  ContainerTouch,
  Icon,
  Image,
  Slide,
  Text,
  TextDone,
  Touch,
} from './styles';

interface Item {
  item: Props;
}

interface Props {
  key: number;
  title: string;
  description: string;
}

const Introduction: React.FC = () => {
  const { setIntroduction } = useAuth();

  const IntroductionFinish = async () => {
    await AsyncStorage.setItem('INTRO-APP', JSON.stringify(true));
    setIntroduction(true);
  };

  const slides = [
    {
      key: 1,
      title: 'Spotx',
      description: `Bem-vindo(a) a Spotx ${'\n'}  ${'\n'} Nosso aplicativo foi preparado para monitorar todas as etapas do frete. Você poderá enviar e receber documentos relacionados a viagem e também reportar problemas.`,
    },
    {
      key: 2,
      title: 'Spotx',
      description:
        'Vamos te pedir algumas permissões, é fundamental que você aceite para que o monitoramento ocorra de forma efetiva.',
    },
  ];

  const DoneButton = () => {
    return (
      <ContainerTouch onPress={() => IntroductionFinish()}>
        <TextDone>Próximo</TextDone>
        <Icon name="chevron-right" />
      </ContainerTouch>
    );
  };

  const NextButton = () => {
    return (
      <Touch>
        <TextDone>Próximo</TextDone>
        <Icon name="chevron-right" />
      </Touch>
    );
  };

  const renderItemSlide = ({ item }: Item) => {
    return (
      <Container>
        <Slide>
          <ContainerImage>
            <Image source={Logo} resizeMode="center" />
          </ContainerImage>
          <Text>{item.description}</Text>
        </Slide>
      </Container>
    );
  };

  return (
    <Slider
      data={slides}
      renderItem={renderItemSlide}
      renderNextButton={() => <NextButton />}
      renderDoneButton={() => <DoneButton />}
    />
  );
};

export default Introduction;
