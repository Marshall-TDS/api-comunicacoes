import type { Remetente, RemetenteProps } from '../entities/Remetente'

export interface IRemetenteRepository {
  findAll(): Promise<RemetenteProps[]>
  findById(id: string): Promise<RemetenteProps | null>
  findByEmail(email: string): Promise<RemetenteProps | null>
  create(remetente: Remetente): Promise<RemetenteProps>
  update(remetente: Remetente): Promise<RemetenteProps>
  delete(id: string): Promise<void>
}

