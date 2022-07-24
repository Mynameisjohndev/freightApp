/* eslint-disable no-nested-ternary */
import styled from 'styled-components/native';

export const NotificationCard = styled.View`
  width: 100%;
  background-color: ${(props: { is_important: string }) => props.is_important};
  min-height: 120px;
  padding: 10px 15px;
  border: 1px #eeeeee solid;
  border-radius: 5px;
  margin-bottom: 15px;
  display: flex;
`;

export const NotificationTitle = styled.Text`
  font-family: 'Roboto-Medium';
  color: ${(props: { color_font: string }) => props.color_font};
  font-size: 18px;
  margin-bottom: 20px;
`;
export const NotificationBody = styled.Text`
  font-family: 'Roboto-Medium';
  color: ${(props: { color_font: string }) => props?.color_font};
  font-size: 18px;
  margin-bottom: 20px;
`;
export const NotificationDatetime = styled.Text`
  display: flex;
  font-family: 'Roboto-Regular';
  color: ${(props: { color_font: string }) => props?.color_font};
  align-self: flex-end;
  font-size: 16px;
`;
