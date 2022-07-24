import api from '../../../services/api';

interface UploadFreightAttachmentProps {
  type: string;
  name: string;
  description?: string;
  freight_id: string;
  status: string;
  attach?: FormData;
}

export async function uploadFreightAttachment({
  type,
  name,
  description,
  freight_id,
  status,
  attach,
}: UploadFreightAttachmentProps) {
  const { data: newAttach } = await api.post(`/freights/attachments`, {
    type,
    name,
    description,
    freight_id,
    status,
  });
  try {
    await api.patch(`/freights/attachments/${newAttach.id}`, attach);
    return 'O status do frete foi atualizado e o anexo adicionado com sucesso!';
  } catch {
    await api.delete(`/freights/attachments/${newAttach.id}`);
    return 'Erro ao adicionar anexo';
  }
}
