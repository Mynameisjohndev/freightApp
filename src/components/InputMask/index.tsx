import React from 'react';
import { TextInputMaskProps } from 'react-native-masked-text';
import { useField } from '@unform/core';

import { Container, TextInput, Icon, TextInputError } from './styles';

interface InputMaskProps extends TextInputMaskProps {
  name: string;
  icon?: string;
}

const InputMask: React.FC<InputMaskProps> = ({ name, icon, ...rest }) => {
  const { fieldName, defaultValue = '', registerField, error } = useField(name);
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    registerField<string>({
      name: fieldName,
      getValue() {
        return value;
      },
      setValue(_, newValue) {
        setValue(newValue);
      },
      clearValue() {
        setValue('');
      },
    });
  }, [registerField, fieldName, value]);

  return (
    <>
      <Container>
        {icon && <Icon name={icon} size={20} color="#515151" />}
        <TextInput
          value={value}
          onChangeText={newValue => {
            setValue(newValue);
          }}
          {...rest}
        />
      </Container>
      {error && <TextInputError>{error}</TextInputError>}
    </>
  );
};

export default InputMask;
