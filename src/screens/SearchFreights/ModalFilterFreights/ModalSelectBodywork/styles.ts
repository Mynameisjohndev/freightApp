import styled from 'styled-components/native';

export const Content = styled.View`
  background-color: #0e3552;
  height: 100px;
  justify-content: center;
  align-items: center;
`;

export const ContainerModal = styled.Modal`
  padding: 10px;
`;

export const ContainerSearch = styled.View`
  flex-direction: row;
  background-color: #fff;
  width: 80%;
  align-self: center;
  border-radius: 2px;
  padding: 0px 15px;
`;

export const Search = styled.TextInput`
  width: 100%;
  font-size: 16px;
`;

export const List = styled.FlatList`
  width: 100%;
  font-size: 16px;
`;

export const Item = styled.TouchableOpacity`
  width: 100%;
  height: 45px;
  padding-left: 14px;
  justify-content: center;
  border-radius: 2px;
`;

export const ItemText = styled.Text``;

export const Row = styled.View`
  height: 1px;
  background-color: #ccc;
  width: 92%;
  align-self: center;
`;

export const ModalHeaderCloseButton = styled.TouchableOpacity``;

export const ModalHeader = styled.View`
  position: relative;
  margin-bottom: 6px;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-family: 'Roboto-Bold';
  color: #0e3552;
`;
