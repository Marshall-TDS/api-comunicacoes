import { z } from 'zod'

export const sendEmailSchema = z.object({
  chave: z.string().min(1, 'Chave da comunicação é obrigatória'),
  destinatario: z.string().email('E-mail do destinatário inválido'),
  variaveis: z.array(z.string()).min(1, 'É necessário fornecer pelo menos uma variável'),
  anexos: z
    .array(
      z.object({
        filename: z.string().min(1),
        content: z.string().min(1), // base64
        contentType: z.string().optional(),
      })
    )
    .optional(),
})

