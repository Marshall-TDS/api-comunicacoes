import type { TipoComunicacao, TipoEnvio } from '../entities/Comunicacao'

export interface CreateComunicacaoDTO {
  tipo: TipoComunicacao
  descricao: string
  assunto: string
  html: string
  remetenteId: string
  tipoEnvio: TipoEnvio
  createdBy: string
}

