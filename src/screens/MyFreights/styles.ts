import { FlatList } from 'react-native';
import styled, { css } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
import { RectButton } from 'react-native-gesture-handler';

import { Freight } from './index';

interface CardFreightProps {
  isDisabled?: boolean;
}

export const Container = styled(FlatList as new () => FlatList<Freight>)`
  flex: 1;
`;

export const ListFreightHeader = styled.View`
  padding: 16px;
  align-items: center;
`;

export const ListFreightHeaderText = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 20px;
  color: #0e3552;
`;

export const NoFreights = styled.View`
  margin: 16px;
  padding: 16px;
  background-color: #fed7d7;
  border-radius: 8px;
  align-items: center;
  flex-direction: row;
`;

export const NoFreigthsIcon = styled(Icon)`
  color: #c53030;
  font-size: 36px;
  margin-right: 16px;
`;

export const NoFreightsMessage = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 20px;
`;

export const CardFreight = styled(RectButton)<CardFreightProps>`
  background-color: #fff;
  padding: 16px;
  border-radius: 5px;
  margin: 16px 16px 0 16px;

  ${props =>
    props.isDisabled &&
    css`
      opacity: 0.7;
      background-color: #e3e3e3;
    `}
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

export const PublishedAtLabel = styled.Text`
  font-family: 'Roboto-Regular';
  color: #737373;
  font-size: 14px;
`;

export const ListFooter = styled.View`
  height: 24px;
`;
