import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../../core/errors/AppError'
import { comunicacaoRepository } from '../repositories'
import { remetenteRepository } from '../../remetentes/repositories'
import { CreateComunicacaoUseCase } from '../useCases/createComunicacao/CreateComunicacaoUseCase'
import { DeleteComunicacaoUseCase } from '../useCases/deleteComunicacao/DeleteComunicacaoUseCase'
import { GetComunicacaoUseCase } from '../useCases/getComunicacao/GetComunicacaoUseCase'
import { ListComunicacoesUseCase } from '../useCases/listComunicacoes/ListComunicacoesUseCase'
import { UpdateComunicacaoUseCase } from '../useCases/updateComunicacao/UpdateComunicacaoUseCase'
import { SendEmailUseCase } from '../useCases/SendEmailUseCase'
import {
  createComunicacaoSchema,
  updateComunicacaoSchema,
} from '../validators/comunicacao.schema'
import { sendEmailSchema } from '../validators/sendEmail.schema'

export class ComunicacaoController {
  constructor(
    private readonly listComunicacoes: ListComunicacoesUseCase,
    private readonly getComunicacao: GetComunicacaoUseCase,
    private readonly createComunicacao: CreateComunicacaoUseCase,
    private readonly updateComunicacao: UpdateComunicacaoUseCase,
    private readonly deleteComunicacao: DeleteComunicacaoUseCase,
    private readonly sendEmail: SendEmailUseCase,
  ) {}

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comunicacoes = await this.listComunicacoes.execute()
      return res.json(comunicacoes)
    } catch (error) {
      return next(error)
    }
  }

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      if (!id) {
        throw new AppError('Parâmetro id é obrigatório', 400)
      }

      const comunicacao = await this.getComunicacao.execute(id)
      return res.json(comunicacao)
    } catch (error) {
      return next(error)
    }
  }

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = createComunicacaoSchema.safeParse(req.body)
      if (!parseResult.success) {
        throw new AppError('Falha de validação', 422, parseResult.error.flatten())
      }

      const comunicacao = await this.createComunicacao.execute(parseResult.data)
      return res.status(201).json(comunicacao)
    } catch (error) {
      return next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      if (!id) {
        throw new AppError('Parâmetro id é obrigatório', 400)
      }

      const parseResult = updateComunicacaoSchema.safeParse(req.body)
      if (!parseResult.success) {
        throw new AppError('Falha de validação', 422, parseResult.error.flatten())
      }

      const comunicacao = await this.updateComunicacao.execute(id, parseResult.data)
      return res.json(comunicacao)
    } catch (error) {
      return next(error)
    }
  }

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      if (!id) {
        throw new AppError('Parâmetro id é obrigatório', 400)
      }

      await this.deleteComunicacao.execute(id)
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  }

  send = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = sendEmailSchema.safeParse(req.body)
      if (!parseResult.success) {
        throw new AppError('Falha de validação', 422, parseResult.error.flatten())
      }

      await this.sendEmail.execute(parseResult.data)
      return res.status(200).json({ status: 'success', message: 'E-mail enviado com sucesso' })
    } catch (error) {
      return next(error)
    }
  }
}

export const comunicacaoController = new ComunicacaoController(
  new ListComunicacoesUseCase(comunicacaoRepository),
  new GetComunicacaoUseCase(comunicacaoRepository),
  new CreateComunicacaoUseCase(comunicacaoRepository),
  new UpdateComunicacaoUseCase(comunicacaoRepository),
  new DeleteComunicacaoUseCase(comunicacaoRepository),
  new SendEmailUseCase(comunicacaoRepository, remetenteRepository),
)

