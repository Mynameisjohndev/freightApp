import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Container, ContainerProps, ButtonText } from './styles';

interface ButtonProps extends RectButtonProperties, ContainerProps {
  children: string;
}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Container {...rest}>
      <ButtonText color={rest.color}>{children}</ButtonText>
    </Container>
  );
};

export default Button;
