import { AppError } from '../../../../core/errors/AppError'
import type { CreateComunicacaoDTO } from '../../dto/CreateComunicacaoDTO'
import { Comunicacao } from '../../entities/Comunicacao'
import type { IComunicacaoRepository } from '../../repositories/IComunicacaoRepository'
import { remetenteRepository } from '../../../remetentes/repositories'

export class CreateComunicacaoUseCase {
  constructor(
    private readonly comunicacaoRepository: IComunicacaoRepository,
  ) {}

  async execute(payload: CreateComunicacaoDTO) {
    // Validar que o remetente existe
    const remetente = await remetenteRepository.findById(payload.remetenteId)
    if (!remetente) {
      throw new AppError('Remetente não encontrado', 404)
    }

    // Validar que tipoEnvio é imediato (agendado ainda não implementado)
    if (payload.tipoEnvio !== 'imediato') {
      throw new AppError('Apenas envio imediato é permitido no momento. O envio agendado será implementado em breve.', 400)
    }

    const comunicacao = Comunicacao.create({
      tipo: payload.tipo,
      descricao: payload.descricao,
      assunto: payload.assunto,
      html: payload.html,
      remetenteId: payload.remetenteId,
      tipoEnvio: payload.tipoEnvio,
      createdBy: payload.createdBy,
      updatedBy: payload.createdBy,
      // chave será gerada automaticamente se não for fornecida
    })

    const createdComunicacao = await this.comunicacaoRepository.create(comunicacao)
    return createdComunicacao
  }
}

