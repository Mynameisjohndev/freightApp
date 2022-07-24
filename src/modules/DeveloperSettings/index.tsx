import { NativeModules } from 'react-native';

const sendMotoristToSettingDeveloperOptions = async () => {
  await NativeModules.RNSettingsDeveloperModules.getSettingsDeveloperOptions();
};

const checkedOptionDevTools = async () => {
  const enabled =
    await NativeModules.RNSettingsDeveloperModules.IsDeveloperSettingsEnabled();

  if (enabled) {
    return Boolean(true);
  }
  return Boolean(false);
};

export const RNDeveloperSettings = {
  checkedOptionDevTools,
  sendMotoristToSettingDeveloperOptions,
};
