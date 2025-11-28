import { AppError } from '../../../../core/errors/AppError'
import type { IComunicacaoRepository } from '../../repositories/IComunicacaoRepository'

export class DeleteComunicacaoUseCase {
  constructor(private readonly comunicacaoRepository: IComunicacaoRepository) {}

  async execute(id: string) {
    const comunicacao = await this.comunicacaoRepository.findById(id)

    if (!comunicacao) {
      throw new AppError('Comunicação não encontrada', 404)
    }

    await this.comunicacaoRepository.delete(id)
  }
}

