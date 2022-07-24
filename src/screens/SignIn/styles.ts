import styled from 'styled-components/native';
import { Form } from '@unform/mobile';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  background-color: #0e3552;
  height: 220px;
  align-items: center;
`;

export const ImageLogo = styled.Image`
  margin-top: 48px;
`;

export const CardMain = styled(Form)`
  background-color: #ff772a;
  height: 180px;
  padding: 20px;
  margin: 0 28px 4px;
  margin-top: -85px;
  border-radius: 5px;
  align-items: center;
  justify-content: space-between;
`;

export const LabelText = styled.Text`
  font-family: 'Roboto-Bold';
  font-size: 18px;
  line-height: 21px;
  color: #fff;
  width: 200px;
  text-align: center;
`;

export const Footer = styled.View`
  flex: 2;
  margin: 28px;
  justify-content: space-between;
  align-items: center;
`;

export const InfoApplication = styled.Text`
  font-family: 'Roboto-Regular';
  color: #0e3552;
  text-align: center;
  /* width: 300px; */
  font-size: 16px;
  margin: 5px;
`;

export const TermsText = styled.Text`
  font-family: 'Roboto-Regular';
  color: #555;
  text-align: center;
  width: 300px;
`;

export const TermsTextPrivacyPolicy = styled.Text`
  font-family: 'Roboto-Regular';
  color: #ff772a;
  text-align: center;
  width: 300px;
`;
