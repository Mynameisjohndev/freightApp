import React, { createContext, useContext } from 'react';
import { Alert, PermissionsAndroid } from 'react-native';

interface ContextData {
  backgroundLocationPermission?: boolean;
  requestBackgroundLocationPermission: () => void;
}

const PermissionsContext = createContext<ContextData>({} as ContextData);

const PermissionsProvider: React.FC = ({ children }) => {
  const [backgroundLocationPermission, setBackgroundLocationPermission] =
    React.useState<boolean>();

  React.useEffect(() => {
    const loadPermissions = async () => {
      const permission = await PermissionsAndroid.check(
        'android.permission.ACCESS_BACKGROUND_LOCATION',
      );
      setBackgroundLocationPermission(permission);
    };
    loadPermissions();
  }, []);

  async function requestBackgroundLocationPermission() {
    const checkBackgroundPermission = await PermissionsAndroid.check(
      'android.permission.ACCESS_BACKGROUND_LOCATION',
    );
    if (!checkBackgroundPermission) {
      Alert.alert(
        'Atenção',
        'O aplicativo da SpotX coleta dados de localização para habilitar o monitoramento da viagem realizada pelo motorista durante o frete, mesmo quando o aplicativo está fechado ou não estiver em uso.',
        [
          {
            text: 'Negar',
            style: 'cancel',
          },
          {
            text: 'Aceitar',
            onPress: async () => {
              const checkFinePermission = await PermissionsAndroid.check(
                'android.permission.ACCESS_FINE_LOCATION',
              );
              if (!checkFinePermission) {
                const permissions = await PermissionsAndroid.requestMultiple([
                  'android.permission.ACCESS_FINE_LOCATION',
                  'android.permission.ACCESS_BACKGROUND_LOCATION',
                ]);
                if (
                  permissions[
                    'android.permission.ACCESS_BACKGROUND_LOCATION'
                  ] === 'granted'
                ) {
                  setBackgroundLocationPermission(true);
                }
              }
            },
          },
        ],
      );
    }
  }

  return (
    <PermissionsContext.Provider
      value={{
        backgroundLocationPermission,
        requestBackgroundLocationPermission,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

function usePermissions(): ContextData {
  const context = useContext(PermissionsContext);
  if (!context)
    throw new Error(
      'usePermissions must be used within an PermissionsProvider',
    );
  return context;
}

export { PermissionsProvider, usePermissions };
