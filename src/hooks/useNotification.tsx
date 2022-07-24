import notifee, {
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
  AndroidImportance,
} from '@notifee/react-native';
import { Alert } from 'react-native';

interface Notification {
  body: string | undefined;
  title: string;
  notification: {
    id?: string;
    title: string;
    body: string;
    subtitle?: string;
  };
}

interface NotificationTrigger {
  title: string;
  body: string;
  timestamp: number;
  repeatFrequency?: RepeatFrequency | undefined;
}

// CHAMAR/MOSTRAR NOTIFICAÇÃO
async function displayAlertNotification(params: Notification) {
  Alert.alert(params.title, params.body);
}

// CHAMAR/MOSTRAR NOTIFICAÇÃO PUBLIC
async function displayPushNotification(params: Notification) {
  const { notification } = params;
  const channelId = await notifee.createChannel({
    id: 'alarm',
    name: 'Important Notifications',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });

  notifee.displayNotification({
    id: notification.title,
    title: notification.title,
    body: notification.body,
    subtitle: notification.subtitle,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      sound: 'default',
    },
  });
}

// AGENDAMENTO DE NOTIFICAÇÃO
async function displayTriggerNotification({
  title,
  body,
  timestamp,
  repeatFrequency,
}: NotificationTrigger) {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp,
    repeatFrequency,
  };

  const triggerNotificationId = await notifee.createTriggerNotification(
    {
      title,
      body,
      android: {
        channelId,
      },
    },
    trigger,
  );
  return triggerNotificationId;
}

// OBTER NOTIFICAÇÕES POR ID QUE ESTÃO AGENDADAS
async function getTriggerNotificationIds() {
  const triggerNotificationIds = await notifee.getTriggerNotificationIds();
  return triggerNotificationIds;
}

// CANCELANDO A/AS NOTIFICAÇÕES AGENDADAS
async function cancelTriggerNotifications(
  notificationIds: string[] | undefined,
) {
  await notifee.cancelTriggerNotifications(notificationIds);
}

// CANCELANDO TODAS AS NOTIFICAÇÕES
async function cancelAllNotifications(): Promise<void> {
  await notifee.cancelAllNotifications();
}

// CANCELAR NOTIFICAÇÃO
async function cancelNotification(notificationId: string) {
  await notifee.cancelNotification(notificationId);
}

export const RNPushNotification = {
  displayAlertNotification,
  displayPushNotification,
  displayTriggerNotification,
  getTriggerNotificationIds,
  cancelTriggerNotifications,
  cancelAllNotifications,
  cancelNotification,
};
