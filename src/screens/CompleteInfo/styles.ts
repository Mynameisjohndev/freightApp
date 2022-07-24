import styled from 'styled-components/native';
import { Form as UForm } from '@unform/mobile';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  background-color: #fff;
  height: 56px;
  align-items: center;
  justify-content: center;
`;

export const ImageLogo = styled.Image``;

export const MainSection = styled.View`
  margin-top: 44px;
  padding: 24px;
  flex: 1;
`;

export const LabelText = styled.Text`
  font-family: 'Roboto-Bold';
  font-size: 24px;
  width: 260px;
  text-align: center;
  align-self: center;
  color: #0e3552;
  margin-bottom: 24px;
`;

export const Form = styled(UForm)`
  flex: 1;
  justify-content: space-between;
`;

export const InputGroup = styled.View``;
