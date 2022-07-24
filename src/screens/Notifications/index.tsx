/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

import { View, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BigList from 'react-native-big-list';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import notifee from '@notifee/react-native';
import {
  NoNotifications,
  NoNotificationsIcon,
  NoNotificationsMessage,
} from './styles';

import CardNotification from '../../components/CardNotification';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

export interface Notification {
  id: string;
  status: string;
  title: string;
  description: string;
  has_important: boolean;
  motorist_id: string;
  with_audio: boolean;
  created_at: string;
}
interface CardNotificationInterface {
  item: {
    id: string;
    title: string;
    body: string;
    created_at: string;
    type: string;
  };
}

const Notifications: React.FC = () => {
  const { setViewerNotifications, countNotifications } = useAuth();

  const [pageCurrent, setPageCurrent] = React.useState(1);
  const [dataState, setDataState] = React.useState([]);
  const [loadingList, setLoadingList] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [noItems, setNoItems] = React.useState(false);

  const { backgroundLocationPermission, requestBackgroundLocationPermission } =
    usePermissions();

  React.useEffect(() => {
    setLoadingList(true);
    getData();
  }, [pageCurrent]);

  React.useEffect(() => {
    handleLoadMoreClear();
  }, [countNotifications]);

  const handleLoadMore = React.useCallback(() => {
    if (!noItems) {
      setPageCurrent(pageCurrent + 1);
      setLoadingList(true);
    } else {
      setLoadingList(false);
    }
  }, [pageCurrent]);

  const handleLoadMoreClear = React.useCallback(() => {
    if (dataState.length >= 1) {
      setRefresh(true);
    } else {
      setLoadingList(true);
    }
    setDataState([]);
    setPageCurrent(1);
    getData();
  }, [countNotifications]);

  async function getData() {
    const motoristString = await AsyncStorage.getItem('@SpotX:motorist');
    const motorist = JSON.parse(String(motoristString));

    return api
      .get('/notifications/push-notification/list', {
        params: {
          motorist_id: motorist.id,
          per_page: 15,
          page: pageCurrent,
        },
      })
      .then(({ data }) => {
        if (data.data.length !== 0) {
          setDataState(dataState.concat(data.data));
          setLoadingList(false);
          setRefresh(false);
          setPageCurrent(data.current_page);
        } else {
          setNoItems(true);
        }
      });
  }

  React.useEffect(() => {
    if (backgroundLocationPermission === false) {
      requestBackgroundLocationPermission();
    }
  }, [backgroundLocationPermission, requestBackgroundLocationPermission]);

  const renderItem = ({ item }: CardNotificationInterface) => {
    return (
      <CardNotification
        key={item.id}
        textTitle={item.title}
        textBody={item.body}
        textDate={item.created_at}
        is_important={item.type}
      />
    );
  };

  const renderHeader = () => {
    return dataState.length >= 1 ? (
      <View style={{ marginVertical: 20 }}>
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            fontFamily: 'Roboto-Medium',
          }}
        >
          Veja suas notificações abaixo:{' '}
        </Text>
      </View>
    ) : null;
  };

  const renderFooter = () => {
    return loadingList && !noItems ? (
      <View
        style={{
          marginVertical: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator style={{ marginBottom: 5 }} size={38} color="#aaa" />
        <Text style={{ color: '#aaa', textAlign: 'center' }}>
          Carregando...
        </Text>
      </View>
    ) : null;
  };

  useFocusEffect(
    React.useCallback(() => {
      if (countNotifications >= 1) {
        setTimeout(() => {
          notifee.cancelAllNotifications();
        }, 5000);
        setViewerNotifications();
      }
      setNoItems(false);
    }, [setViewerNotifications, countNotifications]),
  );

  return dataState.length >= 1 ? (
    <SafeAreaView style={{ flex: 1, width: '100%' }}>
      <BigList
        style={{ padding: 10, paddingVertical: 2 }}
        data={dataState}
        itemHeight="160"
        controlItemRender
        keyExtractor={(item: { id: string }, index) =>
          String(`${item.id}-${index}`)
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        headerHeight={80}
        renderHeader={renderHeader}
        footerHeight={130}
        renderFooter={renderFooter}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => handleLoadMoreClear()}
          />
        }
      />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={{ flex: 1, width: '100%' }}>
      <NoNotifications>
        <NoNotificationsIcon name="bell-off" />
        <NoNotificationsMessage>
          Você ainda não tem notificação!
        </NoNotificationsMessage>
      </NoNotifications>
    </SafeAreaView>
  );
};

export default Notifications;
