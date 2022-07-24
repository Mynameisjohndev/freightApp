import React from 'react';
import { format } from 'date-fns';

import {
  NotificationCard,
  NotificationDatetime,
  NotificationTitle,
  NotificationBody,
} from './styles';

export interface ParamsCard {
  textTitle: string;
  textBody: string;
  textDate: string;
  is_important: string;
}

const CardNotification = ({
  textTitle,
  textDate,
  textBody,
  is_important,
}: ParamsCard) => {
  const date = new Date(textDate);
  const dateFormated = format(date, 'dd/MM/yyyy - hh:mm:ss');
  let color;
  let color_font;
  if (is_important === 'simple') {
    color = 'rgba(255, 255, 255, 1)';
    color_font = 'rgba(115, 115, 115, 1)';
  } else if (is_important === 'important') {
    color = 'rgba(255, 119, 42, 1)';
    color_font = 'rgba(255, 255, 255, 1)';
  } else {
    color = 'rgba(229, 80, 57,1.0)';
    color_font = 'rgba(255, 255, 255, 1)';
  }

  return (
    <>
      <NotificationCard is_important={color}>
        <NotificationTitle color_font={color_font}>
          {textTitle}
        </NotificationTitle>
        <NotificationBody color_font={color_font}>{textBody}</NotificationBody>
        <NotificationDatetime color_font={color_font}>
          {dateFormated}
        </NotificationDatetime>
      </NotificationCard>
    </>
  );
};

export default CardNotification;
