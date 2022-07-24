import styled from 'styled-components/native';
import IconSecondary from 'react-native-vector-icons/Feather';
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #0e3552;
`;

export const Slide = styled.View`
  height: 70%;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${height * 0.2}PX;
  /* background-color: #000; */
`;

export const ContainerImage = styled.View`
  width: 60%;
  align-items: center;
`;
export const Image = styled.Image.attrs({})`
  /* width:8190px; */
`;

export const Text = styled.Text`
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  width: 80%;
`;

export const ContainerTouch = styled.TouchableOpacity`
  /* background-color: #ff772a; */
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 2px;
`;
export const Touch = styled.View`
  /* background-color: #ff772a; */
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 2px;
`;

export const TextDone = styled.Text`
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
`;

export const Icon = styled(IconSecondary).attrs({
  color: '#fff',
})`
  font-size: 28px;
`;
