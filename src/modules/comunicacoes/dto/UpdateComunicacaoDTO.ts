import type { TipoComunicacao, TipoEnvio } from '../entities/Comunicacao'

export interface UpdateComunicacaoDTO {
  tipo?: TipoComunicacao | undefined
  descricao?: string | undefined
  assunto?: string | undefined
  html?: string | undefined
  remetenteId?: string | undefined
  tipoEnvio?: TipoEnvio | undefined
  updatedBy: string
}

