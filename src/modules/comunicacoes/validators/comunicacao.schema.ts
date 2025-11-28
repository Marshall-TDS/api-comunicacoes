import { z } from 'zod'

export const createComunicacaoSchema = z.object({
  tipo: z.enum(['email']),
  descricao: z.string().min(3),
  assunto: z.string().min(1),
  html: z.string().min(1),
  remetenteId: z.string().uuid(),
  tipoEnvio: z.enum(['imediato', 'agendado']),
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
    updatedBy: z.string().min(3),
  })
  .refine((data) => Object.keys(data).some((key) => key !== 'updatedBy'), {
    message: 'Informe ao menos um campo para atualizar',
    path: ['body'],
  })

