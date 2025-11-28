import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import { env } from '../../config/env'

// Token de autenticação (access token)
export interface AuthTokenPayload extends JwtPayload {
  type: 'access'
  userId: string
  login: string
  email: string
  permissions: string[]
}

/**
 * Verifica e decodifica um access token
 */
export const verifyAccessToken = (token: string): AuthTokenPayload => {
  const payload = jwt.verify(token, env.security.jwtSecret) as AuthTokenPayload
  if (payload.type !== 'access') {
    throw new Error('Invalid token type')
  }
  if (!payload.sub || !payload.userId) {
    throw new Error('Invalid token payload')
  }
  return payload
}

