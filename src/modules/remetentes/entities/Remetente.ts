import { randomUUID } from 'crypto'

export interface RemetenteProps {
  id: string
  nome: string
  email: string
  senha: string
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
}

export type CreateRemetenteProps = Omit<RemetenteProps, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateRemetenteProps = {
  nome?: string | undefined
  email?: string | undefined
  senha?: string | undefined
  smtpHost?: string | undefined
  smtpPort?: number | undefined
  smtpSecure?: boolean | undefined
  updatedBy: string
}

export class Remetente {
  private constructor(private props: RemetenteProps) {}

  static create(data: CreateRemetenteProps) {
    const timestamp = new Date()
    return new Remetente({
      ...data,
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
    })
  }

  static restore(props: RemetenteProps) {
    return new Remetente(props)
  }

  update(data: UpdateRemetenteProps) {
    const nextProps: RemetenteProps = { ...this.props }

    if (typeof data.nome !== 'undefined') {
      nextProps.nome = data.nome
    }
    if (typeof data.email !== 'undefined') {
      nextProps.email = data.email
    }
    if (typeof data.senha !== 'undefined') {
      nextProps.senha = data.senha
    }
    if (typeof data.smtpHost !== 'undefined') {
      nextProps.smtpHost = data.smtpHost
    }
    if (typeof data.smtpPort !== 'undefined') {
      nextProps.smtpPort = data.smtpPort
    }
    if (typeof data.smtpSecure !== 'undefined') {
      nextProps.smtpSecure = data.smtpSecure
    }

    nextProps.updatedBy = data.updatedBy
    nextProps.updatedAt = new Date()

    this.props = nextProps
  }

  toJSON(): RemetenteProps {
    return { ...this.props }
  }
}

