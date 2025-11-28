import { Router } from 'express'
import { comunicacaoController } from '../controllers/ComunicacaoController'

export const comunicacaoRoutes = Router()

comunicacaoRoutes.get('/', comunicacaoController.index)
comunicacaoRoutes.post('/', comunicacaoController.store)
comunicacaoRoutes.post('/enviar', comunicacaoController.send)
comunicacaoRoutes.get('/:id', comunicacaoController.show)
comunicacaoRoutes.put('/:id', comunicacaoController.update)
comunicacaoRoutes.delete('/:id', comunicacaoController.destroy)

