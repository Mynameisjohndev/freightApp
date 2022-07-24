import React from 'react';

import {
  Container,
  FreightStatusIcon,
  FreightStatusContent,
  FreightStatusTitle,
  FreightStatusDescription,
  FreightStatusAction,
  FreightStatusActionText,
} from './styles';

interface FreightStatusItemProps {
  situation: 'pending' | 'success' | 'error';
  active: boolean;
  title: string;
  description?: string;
  onAction?: () => void;
}

export default function FreightStatusItem({
  situation,
  active,
  title,
  description,
  onAction,
}: FreightStatusItemProps): JSX.Element {
  async function handleConfirmStatus() {
    if (onAction) onAction();
  }

  return (
    <Container status={situation}>
      {active ? (
        <FreightStatusIcon name="alert-circle" color="#c53030" />
      ) : (
        <FreightStatusIcon
          name={situation === 'pending' ? 'circle' : 'check-circle'}
        />
      )}
      <FreightStatusContent>
        <FreightStatusTitle>{title}</FreightStatusTitle>
        {description && (
          <FreightStatusDescription>{description}</FreightStatusDescription>
        )}
        {active && (
          <FreightStatusAction onPress={handleConfirmStatus}>
            <FreightStatusActionText>Confirmar status</FreightStatusActionText>
          </FreightStatusAction>
        )}
      </FreightStatusContent>
      <FreightStatusIcon name="arrow-right" />
    </Container>
  );
}
