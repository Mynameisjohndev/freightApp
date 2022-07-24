import styled, { css } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
import { RectButton } from 'react-native-gesture-handler';

interface FreightStatusItemProps {
  status?: 'pending' | 'success' | 'error';
}

export const Container = styled.View<FreightStatusItemProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #d7d7d7;

  ${props =>
    props.status === 'pending' &&
    css`
      opacity: 0.6;
    `}
`;

export const FreightStatusIcon = styled(Icon)`
  font-size: 24px;
`;

export const FreightStatusContent = styled.View`
  flex: 1;
  margin-left: 16px;
  margin-right: 16px;
`;

export const FreightStatusTitle = styled.Text`
  font-size: 18px;
  font-family: 'Roboto-Medium';
  color: #0e3552;
`;

export const FreightStatusDescription = styled.Text`
  font-size: 14px;
  font-family: 'Roboto-Regular';
  color: #a4a4a4;
`;

export const FreightStatusAction = styled(RectButton)`
  background-color: #0c9d58;
  padding: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  align-items: center;
  justify-content: center;
`;

export const FreightStatusActionText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-family: 'Roboto-Bold';
`;
