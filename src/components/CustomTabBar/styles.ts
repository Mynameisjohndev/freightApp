import styled, { css } from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface IconProps {
  active: boolean;
  main?: boolean;
}

export const Container = styled.View`
  background-color: #0e3552;
  height: 60px;
  flex-direction: row;
`;

export const MenuItem = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const MenuItemContent = styled.View`
  padding: 8px;
`;

export const MenuItemCenter = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  margin-top: -20px;
  background-color: #fff;
  border: 3px solid #0e3552;
`;

export const Icon = styled(FeatherIcon)<IconProps>`
  font-size: 24px;
  color: #fff;

  ${props =>
    props.main &&
    css`
      font-size: 32px;
      color: #0e3552;
    `}

  ${props =>
    props.active &&
    css`
      color: #ff772a;
    `}
`;

export const IconBadge = styled.View`
  width: 20px;
  height: 20px;
  background-color: #c53030;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
`;

export const IconBadgeText = styled.Text`
  color: #fff;
  font-family: 'Roboto-Bold';
  font-size: 16px;
`;
