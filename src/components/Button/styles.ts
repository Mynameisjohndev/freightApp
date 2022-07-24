import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export interface ContainerProps {
  color?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

function getHeight(size: 'xs' | 'sm' | 'md' | 'lg'): number {
  switch (size) {
    case 'xs':
      return 30;
    case 'sm':
      return 40;

    case 'lg':
      return 60;
    default:
      return 50;
  }
}

export const Container = styled(RectButton)<ContainerProps>`
  min-height: 60px;
  padding: 0 30px;
  border-radius: 5px;

  justify-content: center;
  align-items: center;

  ${props =>
    props.size &&
    css`
      min-height: ${getHeight(props.size)}px;
    `}

  ${props => {
    if (props.color) {
      let bg: string;
      switch (props.color) {
        case 'primary':
          bg = '#ff772a';
          break;
        case 'secondary':
          bg = '#fff';
          break;
        case 'success':
          bg = '#0c9d58';
          break;
        case 'danger':
          bg = '#e00e0e';
          break;

        default:
          bg = '#ff772a';
      }
      return css`
        background-color: ${bg};
      `;
    }
    return css``;
  }}
`;

export const ButtonText = styled.Text<ContainerProps>`
  font-family: 'Roboto-Medium';
  font-size: 18px;

  ${props => {
    if (props.color) {
      let color: string;
      switch (props.color) {
        case 'secondary':
          color = '#0e3552';
          break;

        default:
          color = '#fff';
      }
      return css`
        color: ${color};
      `;
    }
    return css``;
  }}
`;
