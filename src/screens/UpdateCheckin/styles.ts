import styled from 'styled-components/native';
import { Form as UForm } from '@unform/mobile';

export const Container = styled.View`
  flex: 1;
  padding: 24px;
`;

export const LabelPage = styled.Text`
  font-family: 'Roboto-Bold';
  color: #0e3552;
  font-size: 20px;
  text-align: center;
`;

export const Form = styled(UForm)`
  /* flex: 1; */
  justify-content: space-between;
  margin-top: 24px;
`;

export const InputGroup = styled.View``;
