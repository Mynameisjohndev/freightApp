import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
import { RectButton } from 'react-native-gesture-handler';
import IconSecondary from 'react-native-vector-icons/Ionicons';
import IconMap from 'react-native-vector-icons/FontAwesome5';

export const Container = styled.ScrollView`
  flex: 1;
`;

export const MyFreightHeader = styled.View`
  height: 50px;
  flex-direction: row;
  justify-content: space-between;
  background-color: #fff;
`;

export const MapPinIcon = styled(Icon)`
  font-size: 17px;
  margin-right: 17px;
`;

export const MapIcon = styled(IconMap)`
  font-size: 17px;
  margin-right: 17px;
`;

export const FreightStatusContainer = styled.View`
  padding: 16px;
`;

export const InformProblemBtn = styled(RectButton)`
  background-color: #c53030;
  padding: 8px;
  margin-bottom: 24px;
  margin-left: 32px;
  margin-right: 32px;
  align-items: center;
  justify-content: center;
`;

export const RowButton = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
`;

export const ContainerMoreInformation = styled.TouchableOpacity`
  margin-top: 16px;
  align-self: center;
  flex-direction: row;
  background-color: #0e3552;
  width: 48%;
  align-items: center;
  justify-content: flex-start;
  /* height: 30px; */
  padding: 10px;
`;

export const MoreInformation = styled.Text`
  font-family: 'Roboto-Regular';
  color: #fff;
  font-size: 16px;
  font-family: 'Roboto-Bold';
`;

export const IconInfo = styled(IconSecondary)`
  font-size: 24px;
  margin-right: 6px;
`;

export const InformProblemText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-family: 'Roboto-Bold';
`;
