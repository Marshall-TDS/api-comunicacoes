import { Router } from 'express'
import { remetenteRoutes } from '../modules/remetentes/routes/remetente.routes'
import { comunicacaoRoutes } from '../modules/comunicacoes/routes/comunicacao.routes'

export const routes = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

routes.use('/remetentes', remetenteRoutes)
routes.use('/comunicacoes', comunicacaoRoutes)

