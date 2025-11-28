import { Router } from 'express'
import { remetenteController } from '../controllers/RemetenteController'

export const remetenteRoutes = Router()

remetenteRoutes.get('/', remetenteController.index)
remetenteRoutes.post('/', remetenteController.store)
remetenteRoutes.get('/:id', remetenteController.show)
remetenteRoutes.put('/:id', remetenteController.update)
remetenteRoutes.delete('/:id', remetenteController.destroy)

