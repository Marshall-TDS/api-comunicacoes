import { AppError } from '../../../../core/errors/AppError'
import { encryptPassword } from '../../../../core/utils/passwordCipher'
import type { UpdateRemetenteDTO } from '../../dto/UpdateRemetenteDTO'
import { Remetente } from '../../entities/Remetente'
import type { IRemetenteRepository } from '../../repositories/IRemetenteRepository'

export class UpdateRemetenteUseCase {
  constructor(private readonly remetenteRepository: IRemetenteRepository) {}

  async execute(id: string, payload: UpdateRemetenteDTO) {
    const existing = await this.remetenteRepository.findById(id)

    if (!existing) {
      throw new AppError('Remetente não encontrado', 404)
    }

    // Verificar se o email está sendo alterado e se já existe
    if (payload.email && payload.email.toLowerCase() !== existing.email.toLowerCase()) {
      const emailExists = await this.remetenteRepository.findByEmail(payload.email)
      if (emailExists) {
        throw new AppError('E-mail já está em uso', 409)
      }
    }

    const remetente = Remetente.restore(existing)

    // Se a senha foi fornecida, criptografa (usa criptografia bidirecional para poder descriptografar no SMTP)
    const updateData: UpdateRemetenteDTO = { ...payload }
    if (payload.senha) {
      updateData.senha = encryptPassword(payload.senha)
    }

    remetente.update(updateData)

    const updatedRemetente = await this.remetenteRepository.update(remetente)
    
    // Remove a senha da resposta
    const { senha, ...remetenteSemSenha } = updatedRemetente
    return remetenteSemSenha
  }
}

