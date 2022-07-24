import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export const Container = styled.View`
  flex: 1;
`;

export const InfoContainer = styled.ScrollView`
  /* /* flex: 1; */
  padding: 16px;
`;

export const IconDocs = styled(Icon)``;

export const Title = styled.Text`
  font-family: 'Roboto-Bold';
  font-size: 22px;
  color: #0e3552;
  /* margin-right: 16px;
  margin-bottom: 16px; */
`;

export const RowTitle = styled.View`
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

export const ContainerAttachment = styled.View`
  width: 100%;
  align-items: center;
  background-color: #dddddd;
  flex-direction: row;
  margin-bottom: 16px;
  justify-content: space-between;
  padding: 10px;
  min-height: 50px;
`;

export const ContentAttachment = styled.TouchableOpacity`
  flex-direction: row;
`;
export const ShowDoc = styled.TouchableOpacity`
  border-radius: 2px;
  min-width: 15%;
  background-color: #ff772a;
  /* margin-right: 16px; */
  /* padding: 2px; */
  justify-content: center;
  align-items: center;
  height: 25px;
  /* min-height: 10px; */
`;

export const Empty = styled.View`
  min-width: 60px;
  margin-right: 16px;
  padding: 3px;
`;

export const ShowDocText = styled.Text`
  font-size: 12px;
  color: #fff;
  font-family: 'Roboto-Bold';
`;

export const AttachmentIcon = styled(Icon)`
  font-size: 20px;
  margin-left: 16px;
`;

export const AttachmentText = styled.Text`
  color: #0e3552;
  font-size: 16px;
  font-family: 'Roboto-Bold';
`;
export const OrigemText = styled.Text`
  color: #ff772a;
  font-size: 16px;
  margin-left: 16px;
  font-family: 'Roboto-Bold';
`;

export const Text = styled.Text`
  font-size: 16px;
  font-family: 'Roboto-Bold';
`;

export const DeleteAttachment = styled.TouchableOpacity`
  background-color: #e15555;
  height: 45px;
  width: 45px;
  justify-content: center;
  align-items: center;
`;

export const ItemList = styled.Text`
  text-align: center;
  color: #0e3552;
  font-family: 'Roboto-Regular';
`;

export const List = styled.FlatList`
  margin-bottom: 16px;
`;

export const ContainerData = styled.View`
  min-width: 35%;
  justify-content: center;
  align-items: center;
  /* background-color: aqua; */
`;

export const ContainerItem = styled.View`
  min-width: 20%;
  justify-content: center;
  align-items: center;
  /* background-color: aqua; */
`;
export const ContainerStatus = styled.View`
  width: 25%;
  justify-content: center;
  align-items: center;
  /* background-color: aqua; */
`;

export const Header = styled.View`
  width: 100%;
  justify-content: flex-start;
  flex-direction: row;
  padding: 10px;
  background-color: #0e3552;
  margin-bottom: 10px;
`;

export const HeaderItem = styled.Text`
  text-align: center;
  color: #fff;
  font-family: 'Roboto-Bold';
  font-size: 16px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const ContainerOcurrenceSpotx = styled.View`
  width: 80%;
  /* align-items: center; */
  background-color: #cdcdcd;
  flex-direction: column;
  margin-bottom: 16px;
  padding: 10px;
  min-height: 60px;
`;

export const ContainerOcurrence = styled.View`
  width: 100%;
  align-self: flex-end;
  /* align-items: center; */
  background-color: #dddddd;
  flex-direction: column;
  margin-bottom: 16px;
  padding: 10px;
  min-height: 60px;
`;

export const OcurrenceRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  /* background-color: #000; */
`;

export const OcurrenceDescription = styled.View`
  width: 85%;
`;

export const Description = styled.View`
  width: 90%;
`;
export const Column = styled.View`
  flex-direction: column;
`;
