import { AppError } from '../../../../core/errors/AppError'
import type { UpdateComunicacaoDTO } from '../../dto/UpdateComunicacaoDTO'
import { Comunicacao } from '../../entities/Comunicacao'
import type { IComunicacaoRepository } from '../../repositories/IComunicacaoRepository'
import { remetenteRepository } from '../../../remetentes/repositories'

export class UpdateComunicacaoUseCase {
  constructor(
    private readonly comunicacaoRepository: IComunicacaoRepository,
  ) {}

  async execute(id: string, payload: UpdateComunicacaoDTO) {
    const existing = await this.comunicacaoRepository.findById(id)

    if (!existing) {
      throw new AppError('Comunicação não encontrada', 404)
    }

    // Validar que o remetente existe se estiver sendo alterado
    if (payload.remetenteId) {
      const remetente = await remetenteRepository.findById(payload.remetenteId)
      if (!remetente) {
        throw new AppError('Remetente não encontrado', 404)
      }
    }

    // Validar que tipoEnvio é imediato (agendado ainda não implementado)
    if (payload.tipoEnvio && payload.tipoEnvio !== 'imediato') {
      throw new AppError('Apenas envio imediato é permitido no momento. O envio agendado será implementado em breve.', 400)
    }

    const comunicacao = Comunicacao.restore(existing)
    comunicacao.update(payload)

    const updatedComunicacao = await this.comunicacaoRepository.update(comunicacao)
    return updatedComunicacao
  }
}

