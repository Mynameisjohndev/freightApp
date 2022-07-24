import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.ScrollView`
  flex: 1;
`;

export const InfoContainer = styled.View`
  flex: 1;
  padding: 16px;
`;

export const CardFreight = styled.View`
  margin-top: -40px;
  background-color: #fff;
  padding: 16px;
  border-radius: 5px;
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
  justify-content: center;

  border-left-width: 1px;
  border-left-color: #ccc;

  padding-left: 24px;
  padding-top: 12px;
  padding-bottom: 12px;
  margin-left: 8px;
`;

export const DistanceLabel = styled.Text`
  font-family: 'Roboto-Regular';
  color: #737373;
  font-size: 14px;
  line-height: 24px;
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

export const CardDescription = styled.View`
  margin-top: 16px;
  padding-top: 16px;

  border-top-width: 1px;
  border-top-color: #eee;
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const Col = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Label = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 14px;
  color: #0e3552;
`;

export const Value = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 14px;
  color: #737373;
`;

export const Contact = styled.View`
  margin: 24px 0 24px;
`;

export const ContactLabel = styled.Text`
  font-family: 'Roboto-Bold';
  font-size: 24px;
  color: #0e3552;
  text-align: center;
`;

export const SocialButton = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
`;

export const IconContainer = styled.View`
  padding: 12px;
`;

export const IconButton = styled(Icon)`
  font-size: 24px;
  color: #fff;
`;

export const LabelButton = styled.Text`
  font-family: 'Roboto-Medium';
  color: #0e3552;
  font-size: 18px;
  padding: 12px;
`;
