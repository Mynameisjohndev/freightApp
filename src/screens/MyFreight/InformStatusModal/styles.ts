import styled, { css } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
import IconSecondary from 'react-native-vector-icons/FontAwesome5';
import { RectButton } from 'react-native-gesture-handler';

interface ModalButtonProps {
  color?: 'green' | 'orange';
  // enabled?: boolean;
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
  /* min-height: 25%; */
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 16px;
  padding: 16px;
  justify-content: space-between;
  /* flex: 1; */
`;

export const ModalContent = styled.View`
  width: 95%;
  /* min-height: 67%; */
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 16px;
  padding: 16px;
  /* flex: 1; */
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

export const ModalBody = styled.View`
  /* flex: 1; */
`;

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
  border: 1px solid #acacac;
  border-radius: 2px;
`;

export const ModalButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-family: 'Roboto-Bold';
`;

export const ModalCancelButtonText = styled.Text`
  color: #acacac;
  font-size: 16px;
  font-family: 'Roboto-Bold';
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

export const TextInput = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 16px;
`;

export const ModalFooter = styled.View`
  /* margin-top: 24px; */
  /* margin-top: 40px; */
  padding-top: 16px;
  border-top-width: 1px;
  border-top-color: #d7d7d7;
`;

export const CardModal = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  min-height: 40%;
  background-color: #eeeeee;
  flex-direction: column;
`;

export const ContainerAttachment = styled.View`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  background-color: #eeeeee;
  flex-direction: row;
  margin-top: 10px;
`;

export const ContentAttachment = styled.TouchableOpacity`
  flex-direction: row;
  margin-left: 10px;
  width: 20%;
  justify-content: space-between;
`;

export const AttachmentIcon = styled(IconSecondary)`
  font-size: 20px;
`;

export const AttachmentText = styled.Text`
  color: #0e3552;
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
