import { useField } from '@unform/core';
import React from 'react';
import {
  TextInputProps,
  NativeMethods,
  FlatList,
  Keyboard,
} from 'react-native';

import {
  Container,
  InputContainer,
  TextInput,
  Icon,
  TextInputError,
  SuggestionsContainer,
  Suggestion,
  SuggestionItem,
  SuggestionLabel,
} from './styles';

interface Option {
  label: string;
  value: string | number;
}

interface AutocompleteProps extends TextInputProps {
  name: string;
  options: Option[];
  icon?: string;
}

interface Position {
  top?: number;
  bottom?: number;
}

interface InputElementRefProps extends TextInputProps, NativeMethods {}

const Autocomplete: React.FC<AutocompleteProps> = ({
  name,
  options,
  icon,
  onChangeText,
  ...rest
}) => {
  const { fieldName, defaultValue, registerField, error } = useField(name);
  const inputElementRef = React.useRef<InputElementRefProps>(null);
  const suggestionsListPosition = React.useRef<Position>({});

  const keyboardHeight = React.useRef(0);

  const [filteredData, setFilteredData] = React.useState(options);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<Option | null>(
    defaultValue,
  );

  React.useEffect(() => {
    registerField<Option | null>({
      name: fieldName,
      getValue() {
        return selectedItem;
      },
      setValue(_, value) {
        setSelectedItem(value);
      },
      clearValue() {
        setSelectedItem(null);
      },
    });
  }, [registerField, fieldName, selectedItem]);

  React.useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', e => {
      keyboardHeight.current = e.endCoordinates.height;
    });

    return () => {
      keyboardShowListener.remove();
    };
  }, []);

  const filterOptions = React.useCallback(
    (str: string) => {
      const fOption = options.filter(e =>
        e.label.toUpperCase().includes(str.toUpperCase()),
      );
      setFilteredData(fOption);
    },
    [options],
  );

  const displaySuggestions = React.useCallback(() => {
    inputElementRef.current?.measure((fx, fy, width, height, px, py) => {
      const elementHeight = height;
      const elementPosition = py;

      const spaceAboveElement = elementPosition;
      // const spaceBelowElement =
      //   keyboardHeight.current - (elementPosition + elementHeight);

      if (spaceAboveElement > 100) {
        suggestionsListPosition.current = {
          bottom: elementHeight + 20,
        };
      } else {
        suggestionsListPosition.current = {
          top: elementHeight + 12,
        };
      }

      setShowSuggestions(true);
    });
  }, []);

  const handleSelection = React.useCallback(
    (item: Option) => {
      setShowSuggestions(false);
      setFilteredData(options);
      Keyboard.dismiss();
      setSelectedItem(item);
      if (inputElementRef.current)
        inputElementRef.current.setNativeProps({ text: item.label });
    },
    [options],
  );

  const handleOnFocus = React.useCallback(() => {
    setShowSuggestions(true);
    if (options && options.length > 0) {
      displaySuggestions();
    }
    if (selectedItem) {
      setSelectedItem(null);
      inputElementRef.current?.setNativeProps({ text: '' });
    }
  }, [options, displaySuggestions, selectedItem]);

  const handleOnBlur = React.useCallback(() => {
    setShowSuggestions(false);
  }, []);

  const handleOnSubmitEditing = () => {
    setShowSuggestions(false);
  };

  return (
    <Container>
      <InputContainer>
        {icon && <Icon name={icon} size={20} color="#515151" />}
        <TextInput
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ref={inputElementRef}
          onSubmitEditing={handleOnSubmitEditing}
          onChangeText={str => {
            filterOptions(str);
            if (onChangeText) onChangeText(str);
          }}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          clearTextOnFocus
          {...rest}
        />
      </InputContainer>
      {error && <TextInputError>{error}</TextInputError>}

      {showSuggestions && (
        <SuggestionsContainer
          style={[{ elevation: 15 }, suggestionsListPosition.current]}
        >
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            keyboardShouldPersistTaps="always"
            data={filteredData}
            renderItem={({ item }) => (
              <Suggestion onPress={() => handleSelection(item)}>
                <SuggestionItem>
                  <SuggestionLabel>{item.label}</SuggestionLabel>
                </SuggestionItem>
              </Suggestion>
            )}
          />
        </SuggestionsContainer>
      )}
    </Container>
  );
};

export default Autocomplete;
