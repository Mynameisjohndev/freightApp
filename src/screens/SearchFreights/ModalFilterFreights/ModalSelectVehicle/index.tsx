import React, { Dispatch, SetStateAction } from 'react';
import { VehicleProps } from '../..';
import { ModalCloseIcon } from '../styles';
import {
  ContainerModal,
  List,
  Item,
  ItemText,
  Row,
  ModalHeaderCloseButton,
  ModalHeader,
  ModalTitle,
} from './styles';

interface SelectProps {
  setSelected: Dispatch<SetStateAction<VehicleProps | undefined>>;
  options: VehicleProps[];
  closeOption: Dispatch<SetStateAction<boolean>>;
}

const ModalSelectVehicle = ({
  setSelected,
  options,
  closeOption,
  ...rest
}: SelectProps) => {
  const [vehicleSearcheds] = React.useState<VehicleProps[]>(options);
  const selectItemAndCloseOption = (item: VehicleProps) => {
    setSelected(item);
    closeOption(false);
  };

  return (
    <ContainerModal animationType="slide" {...rest}>
      <ModalHeader
        style={{
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <ModalTitle>Selecione um veículo</ModalTitle>
        <ModalHeaderCloseButton onPress={() => closeOption(false)}>
          <ModalCloseIcon name="x" />
        </ModalHeaderCloseButton>
      </ModalHeader>
      <List
        data={vehicleSearcheds}
        keyExtractor={(item: unknown, index: number) => String(index)}
        renderItem={({ item }) => (
          <Item onPress={() => selectItemAndCloseOption(item)}>
            <ItemText>{item.name}</ItemText>
          </Item>
        )}
        ItemSeparatorComponent={() => <Row />}
      />
    </ContainerModal>
  );
};

export default ModalSelectVehicle;
