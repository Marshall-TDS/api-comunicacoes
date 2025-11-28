import { AppError } from '../../../../core/errors/AppError'
import { hashPassword } from '../../../../core/utils/passwordCipher'
import type { CreateRemetenteDTO } from '../../dto/CreateRemetenteDTO'
import { Remetente } from '../../entities/Remetente'
import type { IRemetenteRepository } from '../../repositories/IRemetenteRepository'

export class CreateRemetenteUseCase {
  constructor(private readonly remetenteRepository: IRemetenteRepository) {}

  async execute(payload: CreateRemetenteDTO) {
    const emailExists = await this.remetenteRepository.findByEmail(payload.email)

    if (emailExists) {
      throw new AppError('E-mail já está em uso', 409)
    }

    const senhaCriptografada = await hashPassword(payload.senha)

    const remetente = Remetente.create({
      ...payload,
      senha: senhaCriptografada,
      updatedBy: payload.createdBy,
    })

    const createdRemetente = await this.remetenteRepository.create(remetente)
    
    // Remove a senha da resposta
    const { senha, ...remetenteSemSenha } = createdRemetente
    return remetenteSemSenha
  }
}

