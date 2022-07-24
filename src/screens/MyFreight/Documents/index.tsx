import React from 'react';
import { useRoute } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { format } from 'date-fns';
import api from '../../../services/api';
import {
  AttachmentText,
  Container,
  ItemList,
  Empty,
  InfoContainer,
  ShowDoc,
  ShowDocText,
  Title,
  Row,
  ContainerOcurrence,
  OcurrenceRow,
  OcurrenceDescription,
  Description,
  Column,
} from './styles';
import { Ocurrence } from '../InformProblemModal';
import { Attach } from '../InformStatusModal';
import ShowImageModal from '../../../components/ShowImageModal';

type RouteParams = {
  freightID: string;
};

const Documents = () => {
  const { params } = useRoute();
  const { freightID } = params as RouteParams;
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [ocurrences, setOcurrences] = React.useState<Ocurrence[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [attachments, setAttachments] = React.useState<Attach[]>([]);
  const [hasDoc, setHasDoc] = React.useState(false);
  const [docUri, setDocUri] = React.useState<string | undefined>('');

  const handleSelectDocAttachment = item => {
    setDocUri(item.attachment_file_url);
    setHasDoc(true);
  };

  const handleSelectOcurrence = item => {
    setDocUri(item.occurrence_file_url);
    setHasDoc(true);
  };

  const formatData = (item: string) => {
    const dataCreatedFormated = format(new Date(item), "dd/MM/yyyy 'às' HH:mm");
    return dataCreatedFormated;
  };

  // const formatSatus = (item: string) => {
  //   if (item === 'in_origin') {
  //     return 'Na origem';
  //   }
  //   if (item === 'collecting') {
  //     return 'Coletado';
  //   }
  //   if (item === 'ready') {
  //     return 'Chegou para carregar';
  //   }
  //   if (item === 'on_road') {
  //     return 'Comecei a viagem';
  //   }
  //   if (item === 'in_destination') {
  //     return 'Cheguei para descarregar';
  //   }
  //   if (item === 'delivered') {
  //     return 'Terminou de descarregar';
  //   }
  //   return null;
  // };

  // const validSizeString = (item: string | null) => {
  //   // if (item.length > 10) {
  //   //   return `${item.slice(10)}...`;
  //   // }
  //   // return `${item.slice(0, 10)}...`;
  //   return item;
  // };
  const containerDoc = (item, index: number) => {
    return (
      <ContainerOcurrence key={index}>
        <OcurrenceRow>
          <Column>
            <AttachmentText>
              {item.type === 'other' ? 'Outros ' : `${item.type} `}
            </AttachmentText>
            <AttachmentText>
              {formatData(item.created_at)} -{' '}
              {item.origin === 'app' ? 'Motorista' : 'Spotx'}
            </AttachmentText>
          </Column>
          {item.attachment_file_url !== null ? (
            <ShowDoc onPress={() => handleSelectDocAttachment(item)}>
              <ShowDocText>Ver</ShowDocText>
            </ShowDoc>
          ) : (
            <Empty />
          )}
        </OcurrenceRow>
        <OcurrenceRow style={{ marginTop: 10 }}>
          <Description>
            <ItemList style={{ textAlign: 'justify' }}>
              {item.description}
            </ItemList>
          </Description>
        </OcurrenceRow>
      </ContainerOcurrence>
    );
  };

  const containerDocOcurrence = (item, index: number) => {
    return (
      <ContainerOcurrence key={index}>
        <OcurrenceRow>
          <AttachmentText>
            {formatData(item.created_at)} -{' '}
            {item.origin === 'app' ? 'Motorista' : 'Spotx'}
          </AttachmentText>
          {item.occurrence_file_url !== null ? (
            <ShowDoc onPress={() => handleSelectOcurrence(item)}>
              <ShowDocText>Ver</ShowDocText>
            </ShowDoc>
          ) : (
            <Empty />
          )}
        </OcurrenceRow>
        <OcurrenceRow style={{ marginTop: 10 }}>
          <OcurrenceDescription>
            <ItemList style={{ textAlign: 'justify' }}>
              {item.description}
            </ItemList>
          </OcurrenceDescription>
        </OcurrenceRow>
      </ContainerOcurrence>
    );
  };

  const loadAttachments = React.useCallback(async () => {
    setIsLoading(true);
    const { data: allAttachments } = await api.get(
      `/freights/attachments/${freightID}`,
    );

    setAttachments(allAttachments);
    setIsLoading(false);
  }, [freightID]);

  const loadOcurrences = React.useCallback(async () => {
    setIsRefreshing(true);
    const { data: allOcurrencs } = await api.get(
      `/freights/occurrences/${freightID}`,
    );
    setOcurrences(allOcurrencs);
    setIsRefreshing(false);
  }, [freightID]);

  React.useEffect(() => {
    loadAttachments();
    loadOcurrences();
  }, [loadAttachments, loadOcurrences]);

  return (
    <Container>
      <InfoContainer contentContainerStyle={{ paddingBottom: 36 }}>
        <Row>
          <Title>Anexos</Title>
          {isLoading === true && (
            <ActivityIndicator size={25} color="#0e3552" />
          )}
        </Row>
        {attachments.length > 0 && (
          <>
            {attachments.map((item, index) => {
              return containerDoc(item, index);
            })}
          </>
        )}
        <Row>
          <Title>Ocorrências</Title>
          {isRefreshing === true && (
            <ActivityIndicator size={25} color="#0e3552" />
          )}
        </Row>
        {ocurrences.length > 0 &&
          ocurrences.map((item, index) => {
            return containerDocOcurrence(item, index);
          })}
      </InfoContainer>
      <ShowImageModal
        imageUri={docUri}
        isOpen={hasDoc}
        onClose={() => setHasDoc(false)}
      />
    </Container>
  );
};
export default Documents;
