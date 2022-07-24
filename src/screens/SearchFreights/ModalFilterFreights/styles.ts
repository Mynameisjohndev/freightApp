import styled, { css } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
import { RectButton } from 'react-native-gesture-handler';

interface ModalButtonProps {
  color?: 'green' | 'orange';
}

export const Container = styled.View`
  background-color: rgba(0, 0, 0, 0.5);
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ModalAttachment = styled.View`
  width: 95%;
  max-height: 90%;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 16px;
  padding: 16px;
  justify-content: space-between;
`;

export const ModalContent = styled.View`
  width: 95%;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 16px;
  padding: 16px;
`;

export const ModalHeader = styled.View`
  position: relative;
  padding-right: 24px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #d7d7d7;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-family: 'Roboto-Bold';
  color: #0e3552;
`;

export const ModalHeaderCloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  top: 0;
`;

export const ModalCloseIcon = styled(Icon)`
  font-size: 24px;
`;

export const ModalBody = styled.View``;

export const ModalButton = styled(RectButton)<ModalButtonProps>`
  padding: 12px;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  ${props =>
    props.color === 'green'
      ? css`
          background-color: #0c9d58;
        `
      : props.color === 'orange' &&
        css`
          background-color: #ff772a;
        `}
`;

export const CancelModalButton = styled.TouchableOpacity`
  padding: 12px;
  align-items: center;
  justify-content: center;
  border: 1px solid #ff772a;
  border-radius: 2px;
`;

export const ModalButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-family: 'Roboto-Bold';
`;

export const ModalCancelButtonText = styled.Text`
  color: #ff772a;
  font-size: 16px;
  font-family: 'Roboto';
`;

export const ModalText = styled.Text`
  color: #0e3552;
  font-size: 16px;
  font-family: 'Roboto-Bold';
  width: 80%;
  align-self: center;
  text-align: center;
  margin: 12px;
`;

export const SeparatorText = styled.Text`
  color: #0e3552;
  font-size: 16px;
  font-family: 'Roboto-Bold';
  width: 80%;
  align-self: center;
  text-align: center;
  margin: 40px;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;

export const ModalFooter = styled.View`
  margin-top: 16px;
  padding-top: 16px;
  border-top-width: 1px;
  border-top-color: #d7d7d7;
`;

export const Content = styled.View`
  flex-direction: column;
`;

export const InputSelect = styled.TouchableOpacity`
  background-color: #efefef;
  border-radius: 2px;
  padding: 15px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin-bottom: 10px;
`;

export const InputSelectText = styled.Text`
  color: #808080;
`;

export const Clean = styled.TouchableOpacity``;

export const CleanIcon = styled(Icon)`
  font-size: 20px;
`;
