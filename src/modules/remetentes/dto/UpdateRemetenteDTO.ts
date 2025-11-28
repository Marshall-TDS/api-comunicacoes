export interface UpdateRemetenteDTO {
  nome?: string | undefined
  email?: string | undefined
  senha?: string | undefined
  smtpHost?: string | undefined
  smtpPort?: number | undefined
  smtpSecure?: boolean | undefined
  updatedBy: string
}

