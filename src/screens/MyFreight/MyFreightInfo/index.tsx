import React, { useEffect, useState } from 'react';

import {
  Container,
  InfoContainer,
  CardFreight,
  CardHeader,
  PriceLabel,
  CardBody,
  Origin,
  OriginIcon,
  OriginLabel,
  DistanceLabel,
  Destination,
  DestinationIcon,
  DestinationLabel,
  Distance,
  CardDescription,
  Row,
  Col,
  Label,
  Value,
  RowCollumn,
} from './styles';
import { Freight } from '..';
import { HistoryType } from '../../MyFreightInfo';

interface MyFreightInfoProps {
  freight: Freight;
  history: HistoryType[];
}

const MyFreightInfo: React.FC<MyFreightInfoProps> = ({ freight, history }) => {
  const [collecting, setCollecting] = useState<HistoryType>();

  const loadFreightInfo = React.useCallback(async () => {
    const data = history.find(item => item.status === 'collecting');
    setCollecting(data);
  }, [history]);

  useEffect(() => {
    loadFreightInfo();
  }, [loadFreightInfo]);

  return (
    <>
      <Container>
        <InfoContainer>
          <CardFreight>
            <CardHeader>
              <PriceLabel>
                Criado em: {freight?.created_at_formatted}
              </PriceLabel>
            </CardHeader>

            <CardBody>
              <Origin>
                <OriginIcon name="map-pin" />
                <OriginLabel>
                  {freight?.origin.name} - {freight?.origin.state.uf}
                </OriginLabel>
              </Origin>

              <Distance>
                <DistanceLabel>{freight?.distance} Km</DistanceLabel>
              </Distance>

              <Destination>
                <DestinationIcon name="circle" />
                <DestinationLabel>
                  {freight?.destination.name} - {freight?.destination.state.uf}
                </DestinationLabel>
              </Destination>
            </CardBody>

            <CardDescription>
              <Row>
                <Col>
                  <Label>Veículos: </Label>
                  <Value>{freight?.vehicles}</Value>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label>Carrocerias: </Label>
                  <Value>{freight?.bodies}</Value>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label>Espécie: </Label>
                  <Value>{freight?.item.category.name}</Value>
                </Col>
                <Col>
                  <Label>Produtos: </Label>
                  <Value>{freight?.item.name}</Value>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label>Rastreador: </Label>
                  <Value>{freight?.item.require_tracker ? 'Sim' : 'Não'}</Value>
                </Col>
                <Col>
                  <Label>Complemento: </Label>
                  <Value>{freight?.item.has_complement ? 'Sim' : 'Não'}</Value>
                </Col>
              </Row>
              <RowCollumn />
              {freight?.item.weight && (
                <>
                  <Row>
                    <Col>
                      <Label>Peso: </Label>
                      <Value>{freight?.item.weight}</Value>
                    </Col>
                  </Row>
                  <RowCollumn />
                </>
              )}
              <Row>
                <Col>
                  <Label>Coletado em: </Label>
                  <Value>
                    {collecting?.created_at || 'Ainda não coletado'}
                  </Value>
                </Col>
              </Row>
              <RowCollumn />
              <Row>
                <Col>
                  <Label>Preço: </Label>
                  <Value>R$ {freight?.suggested_price}</Value>
                </Col>
              </Row>
              <RowCollumn />
              <Row>
                <Col>
                  <Label>Origem: </Label>
                  <Value>{freight?.origin.name}</Value>
                </Col>
              </Row>
              <RowCollumn />
              <Row>
                <Col>
                  <Label>Destino: </Label>
                  <Value>{freight?.destination.name}</Value>
                </Col>
              </Row>
            </CardDescription>
          </CardFreight>
        </InfoContainer>
      </Container>
    </>
  );
};

export default MyFreightInfo;
