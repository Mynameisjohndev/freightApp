import React, { Dispatch, SetStateAction } from 'react';
import { Option } from '../../../UpdateCheckin';

import { ModalCloseIcon } from '../styles';
import {
  ContainerModal,
  ContainerSearch,
  Search,
  Content,
  List,
  Item,
  ItemText,
  Row,
  ModalHeaderCloseButton,
  ModalHeader,
  ModalTitle,
} from './styles';

interface SelectProps {
  handleChangeOrigemcity?: Dispatch<SetStateAction<Option | null | undefined>>;
  options: Option[];
  closeOption: Dispatch<SetStateAction<boolean>>;
  onChangeCity: () => void;
}

const ModalSelectCity: React.FC<SelectProps> = ({
  handleChangeOrigemcity,
  options,
  closeOption,
  onChangeCity,
  ...rest
}) => {
  const [filteredData, setFilteredData] = React.useState<Option[]>([]);
  const [filtered, setFilter] = React.useState<string>('');
  const selectItemAndCloseOption = (item: Option) => {
    if (handleChangeOrigemcity) handleChangeOrigemcity(item);
    closeOption(false);
  };

  const filterOptions = React.useCallback(
    (str: string) => {
      const fOption = options.filter(e =>
        e.label.toUpperCase().includes(str.toUpperCase()),
      );
      setFilteredData(fOption);
    },
    [options],
  );

  React.useEffect(() => {
    if (onChangeCity) onChangeCity(filtered);
  }, [filtered, onChangeCity]);

  return (
    <ContainerModal animationType="slide" {...rest}>
      <Content>
        <ModalHeader>
          <ModalTitle>Selecione uma cidade</ModalTitle>
          <ModalHeaderCloseButton onPress={() => closeOption(false)}>
            <ModalCloseIcon color="#fff" name="x" />
          </ModalHeaderCloseButton>
        </ModalHeader>
        <ContainerSearch style={{ elevation: 4 }}>
          <Search
            onChangeText={str => {
              filterOptions(str);
              setFilter(str);
            }}
            placeholder="Procure uma cídade"
          />
        </ContainerSearch>
      </Content>
      <List
        data={filteredData}
        keyExtractor={(item: unknown, index: number) => String(index)}
        renderItem={({ item }) => (
          <Item onPress={() => selectItemAndCloseOption(item)}>
            <ItemText>{item.label}</ItemText>
          </Item>
        )}
        ItemSeparatorComponent={() => <Row />}
      />
    </ContainerModal>
  );
};

export default ModalSelectCity;
