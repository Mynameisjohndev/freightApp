import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const Load = styled.Modal`
  background-color: #0e3552;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const Logo = styled.Image`
  width: 60%;
  height: 10%;
`;

export const ContainerLoad = styled.View`
  background-color: #fff;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const WelcomeVideo = styled.View`
  width: 100%;
  height: 180px;
  background-color: #333;
  justify-content: center;
  align-items: center;
`;

export const MainContent = styled.View`
  flex: 1;
  padding: 24px;
`;

export const LabelPage = styled.Text`
  font-family: 'Roboto-Bold';
  color: #0e3552;
  font-size: 20px;
  text-align: center;
`;

export const SpotContainer = styled.View`
  flex: 1;
  margin-top: 14px;
  justify-content: center;
  align-items: center;
`;

export const SpotButton = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: #ff772a;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const SpotLabel = styled.View`
  align-items: center;
`;

export const LabelPrimary = styled.Text`
  font-family: 'Roboto-Medium';
  color: #0e3552;
  font-size: 18px;
`;

export const LabelSecondary = styled.Text`
  font-family: 'Roboto-Regular';
  color: #0e3552;
  font-size: 14px;
`;
