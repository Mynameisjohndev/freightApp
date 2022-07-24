/* eslint-disable consistent-return */
export interface MessageInfo {
  status: 'collecting' | 'ready' | 'on_road' | 'in_destination' | 'delivered';
}

interface alertMessage {
  title: string;
  description: string;
}

const validStatusFreight = (status: string) => {
  if (status === 'collecting') {
    const message = {
      title: 'Saiu para coleta',
      description: 'Você confirma que está indo para coleta?',
    } as alertMessage;
    return message;
  }
  if (status === 'ready') {
    const message = {
      title: 'Chegou para carregar',
      description: 'Você confirma que chegou para carregar?',
    } as alertMessage;
    return message;
  }
  if (status === 'on_road') {
    const message = {
      title: 'Comecei a viagem',
      description: 'Você confirma que está indo para o destino?',
    } as alertMessage;
    return message;
  }
  if (status === 'in_destination') {
    const message = {
      title: 'Cheguei para descarregar',
      description: 'Você confirma que chegou no destino?',
    } as alertMessage;
    return message;
  }
  if (status === 'delivered') {
    const message = {
      title: 'Terminou de descarregar',
      description: 'Você confirma que terminou de descarregar?',
    } as alertMessage;
    return message;
  }

  return { title: status, description: status };
};

export default validStatusFreight;
