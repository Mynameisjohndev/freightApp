import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
import { FlatList } from 'react-native';
import { Notification } from '.';

export const Container = styled(FlatList as new () => FlatList<Notification>)`
  flex: 1;
  padding: 15px;
`;
export const ContainerNoNotification = styled.View`
  flex: 1;
  padding: 10px;
`;

export const NoNotifications = styled.View`
  margin: 20px 10px;
  padding: 10px;
  height: 75px;
  background-color: #fed7d7;

  border-radius: 8px;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
`;

export const NoNotificationsIcon = styled(Icon)`
  color: #c53030;
  font-size: 36px;
  margin-right: 16px;
`;

export const NoNotificationsMessage = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 21px;
  text-align: left;
`;
