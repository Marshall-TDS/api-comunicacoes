export interface SendEmailDTO {
  chave: string
  destinatario: string
  variaveis: string[]
  anexos?: Array<{
    filename: string
    content: string // base64
    contentType?: string | undefined
  }> | undefined
}

