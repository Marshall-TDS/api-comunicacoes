import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../../core/errors/AppError'
import { remetenteRepository } from '../repositories'
import { CreateRemetenteUseCase } from '../useCases/createRemetente/CreateRemetenteUseCase'
import { DeleteRemetenteUseCase } from '../useCases/deleteRemetente/DeleteRemetenteUseCase'
import { GetRemetenteUseCase } from '../useCases/getRemetente/GetRemetenteUseCase'
import { ListRemetentesUseCase } from '../useCases/listRemetentes/ListRemetentesUseCase'
import { UpdateRemetenteUseCase } from '../useCases/updateRemetente/UpdateRemetenteUseCase'
import {
  createRemetenteSchema,
  updateRemetenteSchema,
} from '../validators/remetente.schema'

export class RemetenteController {
  constructor(
    private readonly listRemetentes: ListRemetentesUseCase,
    private readonly getRemetente: GetRemetenteUseCase,
    private readonly createRemetente: CreateRemetenteUseCase,
    private readonly updateRemetente: UpdateRemetenteUseCase,
    private readonly deleteRemetente: DeleteRemetenteUseCase,
  ) {}

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const remetentes = await this.listRemetentes.execute()
      return res.json(remetentes)
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

      const remetente = await this.getRemetente.execute(id)
      return res.json(remetente)
    } catch (error) {
      return next(error)
    }
  }

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = createRemetenteSchema.safeParse(req.body)
      if (!parseResult.success) {
        throw new AppError('Falha de validação', 422, parseResult.error.flatten())
      }

      const remetente = await this.createRemetente.execute(parseResult.data)
      return res.status(201).json(remetente)
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

      const parseResult = updateRemetenteSchema.safeParse(req.body)
      if (!parseResult.success) {
        throw new AppError('Falha de validação', 422, parseResult.error.flatten())
      }

      const remetente = await this.updateRemetente.execute(id, parseResult.data)
      return res.json(remetente)
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

      await this.deleteRemetente.execute(id)
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  }
}

export const remetenteController = new RemetenteController(
  new ListRemetentesUseCase(remetenteRepository),
  new GetRemetenteUseCase(remetenteRepository),
  new CreateRemetenteUseCase(remetenteRepository),
  new UpdateRemetenteUseCase(remetenteRepository),
  new DeleteRemetenteUseCase(remetenteRepository),
)

