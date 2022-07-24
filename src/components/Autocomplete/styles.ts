import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

export const Container = styled.View``;

export const InputContainer = styled.View`
  width: 100%;
  height: 56px;
  background-color: #fff;
  border-radius: 5px;

  padding: 0 16px;
  margin-bottom: 8px;

  flex-direction: row;
  align-items: center;
`;

export const TextInput = styled.TextInput`
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
  margin-top: -12px;
  margin-bottom: 8px;
  text-align: left;
`;

export const SuggestionsContainer = styled.View`
  background-color: #fff;
  width: 100%;
  max-height: 150px;
  border-radius: 5px;

  position: absolute;
  right: 0;
  z-index: 9999;
`;

export const Suggestion = styled.TouchableOpacity``;

export const SuggestionItem = styled.View`
  padding: 14px;
  width: 100%;
`;

export const SuggestionLabel = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 14px;
  color: #333;
`;
