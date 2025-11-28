import { z } from 'zod'

// Validação para chave: apenas letras, números e hífens, tudo maiúsculo
const chaveSchema = z
  .string()
  .min(3, 'A chave deve ter pelo menos 3 caracteres')
  .max(255, 'A chave deve ter no máximo 255 caracteres')
  .regex(/^[A-Z0-9-]+$/, 'A chave deve conter apenas letras maiúsculas, números e hífens')
  .refine((val) => !val.startsWith('-') && !val.endsWith('-'), {
    message: 'A chave não pode começar ou terminar com hífen',
  })
  .refine((val) => !val.includes('--'), {
    message: 'A chave não pode conter hífens consecutivos',
  })

export const createComunicacaoSchema = z.object({
  tipo: z.enum(['email']),
  descricao: z.string().min(3),
  assunto: z.string().min(1),
  html: z.string().min(1),
  remetenteId: z.string().uuid(),
  tipoEnvio: z.enum(['imediato', 'agendado']),
  chave: chaveSchema.optional(),
  createdBy: z.string().min(3),
})

export const updateComunicacaoSchema = z
  .object({
    tipo: z.enum(['email']).optional(),
    descricao: z.string().min(3).optional(),
    assunto: z.string().min(1).optional(),
    html: z.string().min(1).optional(),
    remetenteId: z.string().uuid().optional(),
    tipoEnvio: z.enum(['imediato', 'agendado']).optional(),
    chave: chaveSchema.optional(),
    updatedBy: z.string().min(3),
  })
  .refine((data) => Object.keys(data).some((key) => key !== 'updatedBy'), {
    message: 'Informe ao menos um campo para atualizar',
    path: ['body'],
  })

