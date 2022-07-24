import React from 'react';
import { ActivityIndicator, Button, Modal, SafeAreaView } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

interface ShowImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUri: string;
}

const ShowImageModal: React.FC<ShowImageModalProps> = ({
  isOpen,
  onClose,
  imageUri,
}: ShowImageModalProps) => {
  const images = [
    {
      url: imageUri,
    },
  ];

  return (
    <Modal style={{ flex: 1 }} visible={isOpen} animationType="fade">
      <Button title="Fechar" onPress={onClose} />
      <SafeAreaView style={{ flex: 1 }}>
        <ImageViewer
          imageUrls={images}
          loadingRender={() => <ActivityIndicator size={35} color="#0e3552" />}
          backgroundColor="#fff"
        />
      </SafeAreaView>
    </Modal>
  );
};

export default ShowImageModal;
