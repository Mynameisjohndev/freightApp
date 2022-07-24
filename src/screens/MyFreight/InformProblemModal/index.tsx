/* eslint-disable no-nested-ternary */
import React, { useState, ReactNode } from 'react';
import { Modal, Alert, ActivityIndicator, ScrollView } from 'react-native';
import {
  RectButtonProps,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  Container,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalHeaderCloseButton,
  ModalCloseIcon,
  ModalTitle,
  TextInput,
  ModalButton,
  ModalButtonText,
  ModalCancelButtonText,
  CancelModalButton,
  ModalText,
  SeparatorText,
  ModalAttachment,
  CardModal,
  ContainerAttachment,
  AttachmentIcon,
  AttachmentText,
  ContentAttachment,
  DeleteAttachment,
  Label,
} from './styles';
import { uploadFreightOcurrence } from './helpers';
// import api from '../../../services/api';
// import {
//   ButtonLink,
//   ButtonLinkIcon,
//   ButtonLinkText,
// } from '../InformStatusModal/styles';
import ShowImageModal from '../../../components/ShowImageModal';

export interface Ocurrence {
  id: string;
  type: string;
  name: string;
  description: string;
  freight_status: string;
  occurrence_file_url: string;
  updated_at: string;
  created_at: string;
  freight_id: string;
  occurrence_file: string;
}
interface InformProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: string;
  freight_id: string;
}

type Props = RectButtonProps & {
  children: ReactNode;
  color?: 'orange' | 'green';
  enabled?: boolean;
};

export function InformProblemModal({
  isOpen = false,
  onClose,
  status,
  freight_id,
}: InformProblemModalProps): JSX.Element {
  const [isLoading, setIsLoading] = React.useState(false);
  const [description, setDescription] = useState('');
  // const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [modalScreen, setModalScreen] = React.useState<
    'description' | 'inform-problem' | 'attachment'
  >('description');
  const [hasOcurrence, setHasOcurrence] = React.useState(false);
  const [ocurrenceUri, setOcurrenceUri] = React.useState<string | undefined>(
    '',
  );
  const [attachment, setAttachment] = useState<FormData>();
  const [loadAttachment, setLoadAttachment] = useState(false);

  const Button = ({ children, color, ...rest }: Props) => {
    return (
      <GestureHandlerRootView
        style={{
          width: `${color === 'orange' && loadAttachment ? '80%' : '100%'}`,
        }}
      >
        <ModalButton color={color} {...rest}>
          {children}
        </ModalButton>
      </GestureHandlerRootView>
    );
  };

  async function handleLaunchLibrary() {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
    });
    if (result.assets && result.assets.length > 0) {
      const photo = result.assets[0];
      setOcurrenceUri(photo.uri);
      const occurrence = new FormData();
      occurrence.append('occurrence', {
        name: photo.fileName,
        type: photo.type,
        uri: photo.uri,
      });
      setAttachment(occurrence);
    }
  }

  async function handleLaunchCamera() {
    const result = await launchCamera({
      mediaType: 'mixed',
    });
    if (result.assets && result.assets.length > 0) {
      const photo = result.assets[0];
      setOcurrenceUri(photo.uri);
      const occurrence = new FormData();
      occurrence.append('occurrence', {
        name: photo.fileName,
        type: photo.type,
        uri: photo.uri,
      });
      setAttachment(occurrence);
    }
  }

  const handleCloseLoadAttachment = () => {
    if (attachment) {
      Alert.alert(
        'Anexar comprovante',
        'Você possui um arquivo anexado, deseja cancelar o envio dele?',
        [
          {
            text: 'Não',
            style: 'cancel',
          },
          {
            text: 'Sim',
            style: 'default',
            onPress: () => {
              setAttachment(undefined);
              setModalScreen('inform-problem');
              setLoadAttachment(false);
            },
          },
        ],
        { cancelable: true },
      );
    } else {
      setModalScreen('inform-problem');
      setLoadAttachment(false);
    }
  };

  const handleLoadAttachment = async () => {
    setLoadAttachment(true);
    setModalScreen('attachment');
  };

  const handleInformProblem = async () => {
    if (description === '') {
      Alert.alert('Informar problema', 'Descreva seu problema para prosseguir');
    } else {
      setModalScreen('inform-problem');
    }
  };

  const handleCloseModal = () => {
    setIsLoading(false);
    setLoadAttachment(false);
    setModalScreen('description');
    onClose();
    setDescription('');
    setAttachment(undefined);
  };

  const validStatusUpload = (message: string) => {
    if (message === 'Anexo adicionado com sucesso!') {
      Alert.alert('Seu problema foi registrado com sucesso!');
      setIsLoading(false);
      onClose();
      setDescription('');
      setAttachment(undefined);
      setModalScreen('description');
      setLoadAttachment(false);
    } else {
      setIsLoading(false);
      Alert.alert(message);
    }
  };

  const handleSendProblem = async () => {
    setIsLoading(true);
    if (attachment) {
      const message = await uploadFreightOcurrence({
        freight_status: status,
        freight_id,
        occurrence: attachment,
        description,
      });
      validStatusUpload(message);
    } else {
      const message = await uploadFreightOcurrence({
        freight_status: status,
        freight_id,
        description,
      });
      validStatusUpload(message);
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <Container>
        {modalScreen === 'description' ? (
          <ModalContent>
            <ModalHeader>
              <ModalHeaderCloseButton onPress={() => handleCloseModal()}>
                <ModalCloseIcon name="x" />
              </ModalHeaderCloseButton>
              <ModalTitle>Informar problema</ModalTitle>
            </ModalHeader>
            <ScrollView>
              <ModalBody />
              <Label>Descreva seu problema</Label>
              <TextInput
                multiline
                numberOfLines={5}
                placeholder="Descrição: "
                value={description}
                onChangeText={setDescription}
              />
              <ModalFooter>
                <Button color="green" onPress={() => handleInformProblem()}>
                  <ModalButtonText>Continuar</ModalButtonText>
                </Button>
                {/* <CancelModalButton style={{ marginTop: 10 }} onPress={onClose}>
                  <ModalCancelButtonText>Cancelar</ModalCancelButtonText>
                </CancelModalButton> */}
              </ModalFooter>
            </ScrollView>
          </ModalContent>
        ) : modalScreen === 'inform-problem' ? (
          <ModalContent>
            <ModalHeader>
              <ModalHeaderCloseButton onPress={() => handleCloseModal()}>
                <ModalCloseIcon name="x" />
              </ModalHeaderCloseButton>
              <ModalTitle>Informar problema</ModalTitle>
            </ModalHeader>
            <ScrollView>
              <ModalBody>
                <ModalText>
                  Antes de enviar, deseja anexar uma foto ou arquivo?
                  (Opcional).
                </ModalText>
                <Button color="orange" onPress={handleLoadAttachment}>
                  <ModalButtonText>Anexar</ModalButtonText>
                </Button>
                <SeparatorText>ou continue</SeparatorText>
              </ModalBody>
              <ModalFooter>
                <Button color="green" onPress={handleSendProblem}>
                  <ModalButtonText>
                    {isLoading === true ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      'Enviar sem anexo'
                    )}
                  </ModalButtonText>
                </Button>
                <CancelModalButton
                  style={{ marginTop: 10 }}
                  onPress={handleCloseModal}
                >
                  <ModalCancelButtonText>Cancelar</ModalCancelButtonText>
                </CancelModalButton>
              </ModalFooter>
            </ScrollView>
          </ModalContent>
        ) : (
          <ModalAttachment>
            <ModalHeader>
              <ModalHeaderCloseButton onPress={handleCloseLoadAttachment}>
                <ModalCloseIcon name="x" />
              </ModalHeaderCloseButton>
              <ModalTitle>Anexar arquivos</ModalTitle>
            </ModalHeader>

            <ModalBody>
              <CardModal>
                <ModalText>
                  Você deseja anexar uma foto ou arquivo relacionado ao trajeto?
                  (opcional).
                </ModalText>
                <Button
                  color="orange"
                  onPress={() => {
                    Alert.alert(
                      'Anexar comprovante',
                      'Escolha uma imagem da sua galeria ou tire uma foto em tempo real',
                      [
                        {
                          text: 'Galeria',
                          style: 'destructive',
                          onPress: handleLaunchLibrary,
                        },
                        {
                          text: 'Tirar foto',
                          style: 'default',
                          onPress: handleLaunchCamera,
                        },
                      ],
                      { cancelable: true },
                    );
                  }}
                >
                  <ModalButtonText>Selecionar</ModalButtonText>
                </Button>
              </CardModal>
              {attachment && (
                <ContainerAttachment>
                  <ContentAttachment onPress={() => setHasOcurrence(true)}>
                    <AttachmentIcon name="paperclip" color="#0e3552" />
                    <AttachmentText>Anexo</AttachmentText>
                  </ContentAttachment>
                  <DeleteAttachment onPress={() => setAttachment(undefined)}>
                    <AttachmentIcon name="trash-alt" color="#ffffff" />
                  </DeleteAttachment>
                </ContainerAttachment>
              )}
            </ModalBody>

            <ModalFooter>
              <Button color="green" onPress={() => handleSendProblem()}>
                <ModalButtonText>
                  {isLoading === true ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    'Enviar com anexo'
                  )}
                </ModalButtonText>
              </Button>
              <CancelModalButton
                style={{ marginTop: 10 }}
                onPress={handleCloseLoadAttachment}
              >
                <ModalCancelButtonText>Cancelar</ModalCancelButtonText>
              </CancelModalButton>
            </ModalFooter>
          </ModalAttachment>
        )}
      </Container>
      <ShowImageModal
        imageUri={ocurrenceUri}
        isOpen={hasOcurrence}
        onClose={() => setHasOcurrence(false)}
      />
    </Modal>
  );
}
