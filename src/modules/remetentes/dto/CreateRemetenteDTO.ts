export interface CreateRemetenteDTO {
  nome: string
  email: string
  senha: string
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  createdBy: string
}

