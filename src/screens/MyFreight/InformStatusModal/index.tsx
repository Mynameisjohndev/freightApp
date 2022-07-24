import React, { useState, ReactNode } from 'react';
import {
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import LocationEnabler from 'react-native-location-enabler';
import GetLocation from 'react-native-get-location';
import {
  GestureHandlerRootView,
  RectButtonProps,
} from 'react-native-gesture-handler';
import api from '../../../services/api';
import {
  Container,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalHeaderCloseButton,
  ModalCloseIcon,
  ModalTitle,
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
  ModalButton,
} from './styles';
import { uploadFreightAttachment } from './helpers';
import { getStatusByName } from '../helpers';
import ShowImageModal from '../../../components/ShowImageModal';
import {
  startForegroundService,
  TASK_ID,
} from '../../../configs/foreground-service';
import validStatusFreight from '../../../utils/validStatusFreight';

interface InformStatusModalProps {
  freight_id: string;
  status: string;
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  statusFreight: any;
  onClose: () => void;
}

export interface Attach {
  id: string;
  type: string;
  name: string;
  description: string;
  status: string;
  attachment_file: string;
  updated_at: string;
  created_at: string;
  freight_id: string;
  attachment_file_url: string;
}

type Props = RectButtonProps & {
  children: ReactNode;
  color?: 'orange' | 'green';
  enabled?: boolean;
};

const { useLocationSettings } = LocationEnabler;

export function InformStatusModal({
  freight_id,
  status,
  statusFreight,
  isOpen = false,
  onClose,
}: InformStatusModalProps): JSX.Element {
  const [hasOcurrence, setHasOcurrence] = React.useState(false);
  const [ocurrenceUri, setOcurrenceUri] = React.useState<string | undefined>(
    '',
  );
  const [attachment, setAttachment] = useState<FormData>();
  const [loadAttachment, setLoadAttachment] = useState(false);
  const [updatingFreightStatus, setUpdatingFreightStatus] =
    React.useState(false);
  const [locationEnabled, requestResolution] = useLocationSettings({
    alwaysShow: true,
  });

  const handlePostAttachment = async () => {
    const message = await uploadFreightAttachment({
      type: 'other',
      name: getStatusByName(status),
      status,
      freight_id,
      attach: attachment,
    });
    Alert.alert(
      message ===
        'O status do frete foi atualizado e o anexo adicionado com sucesso!'
        ? 'Status Atualizado'
        : 'Erro ao atualizar status',
      message,
    );
    onClose();
    setLoadAttachment(false);
    setAttachment(undefined);
  };

  async function handleChangeFreightStatus() {
    const title = validStatusFreight(statusFreight)?.title;
    const description = validStatusFreight(statusFreight)?.description;

    Alert.alert(`${title}`, `${description}`, [
      {
        text: 'Não',
        style: 'cancel',
      },
      {
        text: 'Sim',
        onPress: async () => {
          setUpdatingFreightStatus(true);
          const origin_coords_freight_status =
            await GetLocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 15000,
            });
          const { latitude, longitude } = origin_coords_freight_status;
          const get_coords_freight_status = `${latitude},${longitude}`;
          api
            .put(`/freights/${freight_id}/status`, {
              status: statusFreight,
              origin: 'app',
              get_coords_freight_status,
            })
            .then(async () => {
              if (attachment) {
                await handlePostAttachment();
              } else {
                Alert.alert(
                  'Status Atualizado',
                  'O status do frete foi atualizado com sucesso!',
                );
                setAttachment(undefined);
              }
              setUpdatingFreightStatus(false);
              if (
                ['collecting', 'ready', 'on_road', 'in_destination'].includes(
                  statusFreight,
                )
              ) {
                startForegroundService(freight_id);
              }

              if (statusFreight === 'delivered') {
                ReactNativeForegroundService.stop();
                ReactNativeForegroundService.remove_task(TASK_ID);
              }
            })
            .catch(() => {
              setUpdatingFreightStatus(false);
              ToastAndroid.show(
                'Houve um erro no sistema, tente novamente dentro de instantes.',
                ToastAndroid.LONG,
              );
            });
          onClose();
        },
      },
    ]);
  }

  async function handleValidGps() {
    if (!locationEnabled) {
      requestResolution();
    } else {
      handleChangeFreightStatus();
    }
  }

  async function handleLaunchLibrary() {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
    });
    if (result.assets && result.assets.length > 0) {
      const photo = result.assets[0];
      setOcurrenceUri(photo.uri);
      const attach = new FormData();
      attach.append('attachment', {
        name: photo.fileName,
        type: photo.type,
        uri: photo.uri,
      });
      setAttachment(attach);
    }
  }

  async function handleLaunchCamera() {
    const result = await launchCamera({
      mediaType: 'mixed',
    });
    if (result.assets && result.assets.length > 0) {
      const photo = result.assets[0];
      setOcurrenceUri(photo.uri);
      const attach = new FormData();
      attach.append('attachment', {
        name: photo.fileName,
        type: photo.type,
        uri: photo.uri,
      });
      setAttachment(attach);
    }
  }

  const handleOpenAndCloseAttachment = () => {
    setLoadAttachment(!loadAttachment);
  };

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
              handleOpenAndCloseAttachment();
            },
          },
        ],
        { cancelable: true },
      );
    } else {
      handleOpenAndCloseAttachment();
    }
  };

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

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <Container>
        {loadAttachment === false ? (
          <ModalContent>
            <ModalHeader>
              <ModalHeaderCloseButton onPress={onClose}>
                <ModalCloseIcon name="x" />
              </ModalHeaderCloseButton>
              <ModalTitle>Confirmar status</ModalTitle>
            </ModalHeader>
            <ScrollView>
              <ModalBody>
                <ModalText>
                  Antes de confirmar o status, deseja anexar uma foto ou
                  arquivo? (Opcional).
                </ModalText>
                <Button color="orange" onPress={handleOpenAndCloseAttachment}>
                  <ModalButtonText>Anexar</ModalButtonText>
                </Button>
                <SeparatorText>ou continue</SeparatorText>
              </ModalBody>
              <ModalFooter>
                <Button color="green" onPress={() => handleValidGps()}>
                  <ModalButtonText>
                    {updatingFreightStatus === true ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      'Confirmar Status'
                    )}
                  </ModalButtonText>
                </Button>
                <CancelModalButton style={{ marginTop: 10 }} onPress={onClose}>
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
              <Button color="green" onPress={() => handleChangeFreightStatus()}>
                <ModalButtonText>
                  {updatingFreightStatus === true ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    'Confirmar Status'
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
