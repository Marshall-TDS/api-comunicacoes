import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, type AuthTokenPayload } from '../utils/jwt'
import { AppError } from '../errors/AppError'
import { env } from '../../config/env'

// Estender o tipo Request para incluir informações do usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload
    }
  }
}

/**
 * Lista de rotas públicas que não precisam de autenticação
 * As rotas podem vir com ou sem o prefixo /api
 */
const PUBLIC_ROUTES = [
  '/health',
  '/api/health',
  '/auth/login',
  '/api/auth/login',
  '/auth/logout',
  '/api/auth/logout',
  '/docs',
  '/api/docs',
  '/comunicacoes/enviar',
  '/api/comunicacoes/enviar',
]

/**
 * Verifica se uma rota é pública
 */
const isPublicRoute = (path: string): boolean => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return PUBLIC_ROUTES.some((publicRoute) => {
    // Comparação exata ou verificação se a rota começa com a rota pública
    // e o próximo caractere (se existir) é '/' ou fim da string
    if (normalizedPath === publicRoute) {
      return true
    }
    if (normalizedPath.startsWith(publicRoute)) {
      const nextChar = normalizedPath[publicRoute.length]
      return !nextChar || nextChar === '/' || nextChar === '?'
    }
    return false
  })
}

/**
 * Valida o token fazendo uma requisição para a API de usuários
 * Isso garante que o token está ativo e válido na API principal
 */
const validateTokenWithApiUsuarios = async (token: string): Promise<boolean> => {
  const apiUsuariosUrl = env.apiUsuarios.url
  
  try {
    // Tenta acessar uma rota protegida da API de usuários para validar o token
    const response = await fetch(`${apiUsuariosUrl}/features`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    // Se retornar 401 ou 403, o token é inválido ou não tem permissão
    if (response.status === 401 || response.status === 403) {
      return false
    }

    // Se a API retornar sucesso, o token é válido
    return response.ok
  } catch (error) {
    // Se a API de usuários não estiver disponível, assume que o token é válido
    // (fallback para validação local - importante para desenvolvimento)
    return true
  }
}

/**
 * Middleware de autenticação
 * Valida o access token e adiciona as informações do usuário ao request
 * Primeiro valida localmente, depois verifica na API de usuários se está ativo
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Se for uma rota pública, permite o acesso sem autenticação
    if (isPublicRoute(req.path)) {
      return next()
    }

    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new AppError('Token de autenticação não fornecido', 401)
    }

    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Formato de token inválido. Use: Bearer <token>', 401)
    }

    // Primeiro valida o token localmente (verifica assinatura e expiração)
    let payload: AuthTokenPayload
    try {
      payload = verifyAccessToken(token)
    } catch (error) {
      throw new AppError('Token inválido ou expirado', 401)
    }

    // Depois verifica na API de usuários se o token está ativo
    const isValidInApiUsuarios = await validateTokenWithApiUsuarios(token)
    if (!isValidInApiUsuarios) {
      throw new AppError('Token não está ativo na API de usuários', 401)
    }

    req.user = payload
    next()
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message })
    }
    return res.status(401).json({ status: 'error', message: 'Token inválido ou expirado' })
  }
}

