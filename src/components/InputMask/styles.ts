import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { TextInputMask } from 'react-native-masked-text';

export const Container = styled.View`
  width: 100%;
  height: 56px;
  background-color: #fff;
  border-radius: 5px;

  padding: 0 16px;
  margin-bottom: 8px;

  flex-direction: row;
  align-items: center;
`;

export const TextInput = styled(TextInputMask)`
  flex: 1;
  color: #515151;
  font-family: 'Roboto-Regular';
  font-size: 16px;
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 16px;
`;

export const TextInputError = styled.TextInput`
  width: 100%;
  color: #c53030;
  font-size: 12px;
  padding: 0;
  padding-left: 16px;
  font-family: 'Roboto-Medium';
  margin-top: -20px;
  margin-bottom: 8px;
  text-align: left;
`;
