import type { Comunicacao, ComunicacaoProps } from '../entities/Comunicacao'

export interface IComunicacaoRepository {
  findAll(): Promise<ComunicacaoProps[]>
  findById(id: string): Promise<ComunicacaoProps | null>
  findByChave(chave: string): Promise<ComunicacaoProps | null>
  findByRemetenteId(remetenteId: string): Promise<ComunicacaoProps[]>
  create(comunicacao: Comunicacao): Promise<ComunicacaoProps>
  update(comunicacao: Comunicacao): Promise<ComunicacaoProps>
  delete(id: string): Promise<void>
}

