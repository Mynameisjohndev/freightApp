import api from '../../../services/api';

interface UploadFreightOccurrenceProps {
  description?: string;
  freight_id: string;
  freight_status: string;
  occurrence?: FormData;
}

export async function uploadFreightOcurrence({
  description,
  freight_id,
  freight_status,
  occurrence,
}: UploadFreightOccurrenceProps) {
  const { data: newOcurrence } = await api.post(`/freights/occurrences`, {
    description,
    freight_id,
    freight_status,
    origin: 'app',
  });
  try {
    if (occurrence) {
      await api.patch(`/freights/occurrences/${newOcurrence.id}`, occurrence);
      return 'Anexo adicionado com sucesso!';
    }
    return 'Anexo adicionado com sucesso!';
  } catch {
    await api.delete(`/freights/occurrences/${newOcurrence.id}`);
    return 'Erro ao adicionar anexo';
  }
}
