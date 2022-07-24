import React from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

import { Container, TextInput, Icon, TextInputError } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon?: string;
}

interface InputValueReference {
  value: string;
}

const Input: React.FC<InputProps> = ({ name, icon, ...rest }) => {
  const { fieldName, defaultValue = '', registerField, error } = useField(name);
  const inputValueRef = React.useRef<InputValueReference>({
    value: defaultValue,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputElementRef = React.useRef<any>(null);

  React.useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(_, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [registerField, fieldName]);

  return (
    <>
      <Container>
        {icon && <Icon name={icon} size={20} color="#515151" />}
        <TextInput
          ref={inputElementRef}
          onChangeText={value => {
            inputValueRef.current.value = value;
          }}
          {...rest}
        />
      </Container>
      {error && <TextInputError>{error}</TextInputError>}
    </>
  );
};

export default Input;
