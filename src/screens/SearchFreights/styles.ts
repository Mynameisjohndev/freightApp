import { FlatList, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
import { RectButton } from 'react-native-gesture-handler';

import { Freight } from './index';

const { height } = Dimensions.get('window');

export const Container = styled.View`
  flex: 1;
`;

export const ContainerList = styled(FlatList as new () => FlatList<Freight>)`
  flex: 1;
`;

export const CardFreight = styled(RectButton)`
  background-color: #fff;
  padding: 16px;
  border-radius: 5px;
  margin: 16px 16px 0 16px;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  border-bottom-width: 1px;
  border-bottom-color: #eee;

  padding-bottom: 16px;
  margin-bottom: 16px;
`;

export const PriceLabel = styled.Text`
  font-family: 'Roboto-Bold';
  color: #0e3552;
  font-size: 18px;
`;

export const CardHeaderDescription = styled.View`
  align-items: flex-end;
`;

export const TypeItemLabel = styled.Text`
  font-family: 'Roboto-Regular';
  color: #737373;
  font-size: 14px;
`;

export const VolumeLabel = styled.Text`
  font-family: 'Roboto-Regular';
  color: #737373;
  font-size: 14px;
`;

export const CardBody = styled.View``;

export const Origin = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const OriginIcon = styled(Icon)`
  color: #0e3552;
  font-size: 17px;
  margin-right: 17px;
`;

export const OriginLabel = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 16px;
  color: #0e3552;
`;

export const Distance = styled.View`
  height: 40px;
  justify-content: center;

  border-left-width: 1px;
  border-left-color: #ccc;

  padding-left: 24px;
  margin-left: 8px;
`;

export const DistanceLabel = styled.Text`
  font-family: 'Roboto-Regular';
  color: #737373;
  font-size: 14px;
`;

export const Destination = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const DestinationIcon = styled(Icon)`
  color: #ff772a;
  font-size: 17px;
  margin-right: 17px;
`;

export const DestinationLabel = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 16px;
  color: #0e3552;
`;

export const CardFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;

  padding-top: 16px;
  margin-top: 16px;

  border-top-color: #eee;
  border-top-width: 1px;
`;

export const TimeLabel = styled.Text`
  font-family: 'Roboto-Regular';
  color: #737373;
  font-size: 14px;
`;

export const Row = styled.View`
  background-color: #d7d7d7;
  height: 1px;
  margin: 15px;
  width: 100%;
  align-self: center;
`;

export const PublishedAtLabel = styled.Text`
  font-family: 'Roboto-Regular';
  color: #737373;
  font-size: 14px;
`;

export const ListFooter = styled.View`
  height: 24px;
`;

export const ContainerFilter = styled.View`
  background-color: #fff;
  padding: 16px;
  border-radius: 5px;
  margin: 16px 16px 0 16px;
  min-height: 80px;
`;

export const TextButtton = styled.Text`
  font-family: 'Roboto-Regular';
  color: #fff;
  font-size: 16px;
`;

export const HorizontalText = styled.Text`
  margin: 6px 0px;
  color: #0e3552;
  font-size: 16px;
`;

export const LabelText = styled.Text`
  font-family: 'Roboto-Bold';
`;

export const TextFilter = styled.Text``;

export const ContainerNotification = styled.View`
  justify-content: center;
  align-items: center;
  align-self: center;
  flex-direction: column;
  margin-top: ${height * 0.13}px;
`;

export const NotificationTitle = styled.Text`
  font-family: 'Roboto-Bold';
  text-align: center;
  color: #0e3552;
  font-size: 20px;
`;

export const NotificationDescription = styled.Text`
  font-family: 'Roboto-Bold';
  text-align: center;
  color: #558bb4;
  font-size: 14px;
`;

export const NotificationIcon = styled(Icon)`
  color: #0e3552;
  font-size: 30px;
  text-align: center;
`;
