import { randomUUID } from 'crypto'

export type TipoComunicacao = 'email'
export type TipoEnvio = 'imediato' | 'agendado'

export interface ComunicacaoProps {
  id: string
  tipo: TipoComunicacao
  descricao: string
  assunto: string
  html: string
  remetenteId: string
  tipoEnvio: TipoEnvio
  chave: string
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
}

export type CreateComunicacaoProps = Omit<ComunicacaoProps, 'id' | 'createdAt' | 'updatedAt' | 'chave'> & {
  chave?: string // Chave opcional, se não fornecida será gerada automaticamente
}

export type UpdateComunicacaoProps = {
  tipo?: TipoComunicacao | undefined
  descricao?: string | undefined
  assunto?: string | undefined
  html?: string | undefined
  remetenteId?: string | undefined
  tipoEnvio?: TipoEnvio | undefined
  updatedBy: string
}

export class Comunicacao {
  private constructor(private props: ComunicacaoProps) {}

  static create(data: CreateComunicacaoProps) {
    const timestamp = new Date()
    
    // Se a chave não foi fornecida, gera automaticamente
    let chave = data.chave
    if (!chave) {
      // Gera uma chave única separada por hífen baseada no tipo e timestamp
      chave = `${data.tipo}-${Date.now()}-${randomUUID().substring(0, 8)}`
    }
    
    return new Comunicacao({
      ...data,
      id: randomUUID(),
      chave,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
  }

  static restore(props: ComunicacaoProps) {
    return new Comunicacao(props)
  }

  update(data: UpdateComunicacaoProps) {
    const nextProps: ComunicacaoProps = { ...this.props }

    if (typeof data.tipo !== 'undefined') {
      nextProps.tipo = data.tipo
    }
    if (typeof data.descricao !== 'undefined') {
      nextProps.descricao = data.descricao
    }
    if (typeof data.assunto !== 'undefined') {
      nextProps.assunto = data.assunto
    }
    if (typeof data.html !== 'undefined') {
      nextProps.html = data.html
    }
    if (typeof data.remetenteId !== 'undefined') {
      nextProps.remetenteId = data.remetenteId
    }
    if (typeof data.tipoEnvio !== 'undefined') {
      nextProps.tipoEnvio = data.tipoEnvio
    }

    nextProps.updatedBy = data.updatedBy
    nextProps.updatedAt = new Date()

    this.props = nextProps
  }

  toJSON(): ComunicacaoProps {
    return { ...this.props }
  }
}

