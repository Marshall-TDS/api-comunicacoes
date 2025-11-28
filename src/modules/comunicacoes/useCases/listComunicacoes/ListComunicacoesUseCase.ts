import type { IComunicacaoRepository } from '../../repositories/IComunicacaoRepository'

export class ListComunicacoesUseCase {
  constructor(private readonly comunicacaoRepository: IComunicacaoRepository) {}

  async execute() {
    const comunicacoes = await this.comunicacaoRepository.findAll()
    return comunicacoes
  }
}

