export function getStatusByName(status: string) {
  switch (status) {
    case 'in_origin':
      return 'Ir para coleta';
    case 'collecting':
      return 'Cheguei para carregar';
    case 'ready':
      return 'Começar a viagem';
    case 'on_road':
      return 'Cheguei para descarregar';
    case 'in_destination':
      return 'Terminei de descarregar';
    case 'Finalizar serviço':
      return 'delivered';

    default:
      return '';
  }
}
