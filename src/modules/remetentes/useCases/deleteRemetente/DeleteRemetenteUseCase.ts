import { AppError } from '../../../../core/errors/AppError'
import type { IRemetenteRepository } from '../../repositories/IRemetenteRepository'

export class DeleteRemetenteUseCase {
  constructor(private readonly remetenteRepository: IRemetenteRepository) {}

  async execute(id: string) {
    const remetente = await this.remetenteRepository.findById(id)

    if (!remetente) {
      throw new AppError('Remetente não encontrado', 404)
    }

    await this.remetenteRepository.delete(id)
  }
}

