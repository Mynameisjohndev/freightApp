import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';

import { Container } from './styles';

const Profile: React.FC = () => {
  const { motorist, signOut } = useAuth();
  const { backgroundLocationPermission, requestBackgroundLocationPermission } =
    usePermissions();

  React.useEffect(() => {
    if (backgroundLocationPermission === false) {
      requestBackgroundLocationPermission();
    }
  }, [backgroundLocationPermission, requestBackgroundLocationPermission]);

  return (
    <Container>
      <Text style={{ marginBottom: 16 }}>
        Olá, {motorist.name.toUpperCase()}
      </Text>
      <Text>TELA DE PERFIL</Text>
      <Text>EM CONSTRUÇÃO</Text>
      <TouchableOpacity
        onPress={signOut}
        style={{
          marginTop: 48,
          backgroundColor: '#ff772a',
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text>Sair do app</Text>
      </TouchableOpacity>
    </Container>
  );
};

export default Profile;
