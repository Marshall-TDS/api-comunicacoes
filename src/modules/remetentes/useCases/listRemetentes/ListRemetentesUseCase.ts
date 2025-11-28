import type { IRemetenteRepository } from '../../repositories/IRemetenteRepository'

export class ListRemetentesUseCase {
  constructor(private readonly remetenteRepository: IRemetenteRepository) {}

  async execute() {
    const remetentes = await this.remetenteRepository.findAll()
    
    // Remove a senha de todos os remetentes
    return remetentes.map(({ senha, ...remetenteSemSenha }) => remetenteSemSenha)
  }
}

