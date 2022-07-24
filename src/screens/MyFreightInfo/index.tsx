import React, { useCallback, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import MyFreightInfo from '../MyFreight/MyFreightInfo';
import api from '../../services/api';

// eslint-disable-next-line import/export
interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  phone?: string;
}

export interface HistoryType {
  id: string;
  status: string;
  disabled_reason?: string;
  description?: string;
  freight_id: string;
  user_id?: string;
  motorist_id?: string;
  origin: 'app' | 'tms';
  created_at: string;
  user?: UserType;
}

const MyFreightInformation = () => {
  const [freightHistory, setFreightStatus] = useState<HistoryType[]>([]);
  const route = useRoute();
  const { freight } = route.params;

  const loadHistoryFreight = useCallback(async () => {
    const { data } = await api.get<HistoryType[]>(
      `/freights/freights-status-history/freight/${freight.id}`,
    );
    setFreightStatus(
      data.map(item => ({
        ...item,
        created_at: format(new Date(item.created_at), "dd/MM/yyyy 'às' HH:mm"),
      })),
    );
  }, [freight.id]);

  useEffect(() => {
    loadHistoryFreight();
  }, [loadHistoryFreight]);

  return <MyFreightInfo freight={freight} history={freightHistory} />;
};

export default MyFreightInformation;
