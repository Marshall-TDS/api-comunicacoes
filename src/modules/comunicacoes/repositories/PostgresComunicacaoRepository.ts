import { pool } from '../../../infra/database/pool'
import type { Comunicacao, ComunicacaoProps } from '../entities/Comunicacao'
import type { IComunicacaoRepository } from './IComunicacaoRepository'

type ComunicacaoRow = {
  id: string
  seq_id: string
  tipo: string
  descricao: string
  assunto: string
  html: string
  remetente_id: string
  tipo_envio: string
  chave: string
  created_by: string
  updated_by: string
  created_at: Date
  updated_at: Date
}

const mapRowToProps = (row: ComunicacaoRow): ComunicacaoProps => ({
  id: row.id,
  seqId: row.seq_id ? parseInt(row.seq_id, 10) : undefined,
  tipo: row.tipo as ComunicacaoProps['tipo'],
  descricao: row.descricao,
  assunto: row.assunto,
  html: row.html,
  remetenteId: row.remetente_id,
  tipoEnvio: row.tipo_envio as ComunicacaoProps['tipoEnvio'],
  chave: row.chave,
  createdBy: row.created_by,
  updatedBy: row.updated_by,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export class PostgresComunicacaoRepository implements IComunicacaoRepository {
  async findAll(): Promise<ComunicacaoProps[]> {
    const result = await pool.query<ComunicacaoRow>(
      'SELECT id, seq_id, tipo, descricao, assunto, html, remetente_id, tipo_envio, chave, created_by, updated_by, created_at, updated_at FROM comunicacoes ORDER BY created_at DESC'
    )
    return result.rows.map(mapRowToProps)
  }

  async findById(id: string): Promise<ComunicacaoProps | null> {
    const result = await pool.query<ComunicacaoRow>(
      'SELECT id, seq_id, tipo, descricao, assunto, html, remetente_id, tipo_envio, chave, created_by, updated_by, created_at, updated_at FROM comunicacoes WHERE id = $1',
      [id]
    )
    const row = result.rows[0]
    return row ? mapRowToProps(row) : null
  }

  async findByChave(chave: string): Promise<ComunicacaoProps | null> {
    const result = await pool.query<ComunicacaoRow>(
      'SELECT id, seq_id, tipo, descricao, assunto, html, remetente_id, tipo_envio, chave, created_by, updated_by, created_at, updated_at FROM comunicacoes WHERE chave = $1',
      [chave]
    )
    const row = result.rows[0]
    return row ? mapRowToProps(row) : null
  }

  async findByRemetenteId(remetenteId: string): Promise<ComunicacaoProps[]> {
    const result = await pool.query<ComunicacaoRow>(
      'SELECT id, seq_id, tipo, descricao, assunto, html, remetente_id, tipo_envio, chave, created_by, updated_by, created_at, updated_at FROM comunicacoes WHERE remetente_id = $1 ORDER BY created_at DESC',
      [remetenteId]
    )
    return result.rows.map(mapRowToProps)
  }

  async create(comunicacao: Comunicacao): Promise<ComunicacaoProps> {
    const data = comunicacao.toJSON()
    await pool.query(
      `
        INSERT INTO comunicacoes (
          id, tipo, descricao, assunto, html, remetente_id, tipo_envio, chave,
          created_by, updated_by, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `,
      [
        data.id,
        data.tipo,
        data.descricao,
        data.assunto,
        data.html,
        data.remetenteId,
        data.tipoEnvio,
        data.chave,
        data.createdBy,
        data.updatedBy,
        data.createdAt,
        data.updatedAt,
      ]
    )
    const inserted = await this.findById(data.id)
    if (!inserted) {
      throw new Error('Falha ao recuperar comunicação inserida')
    }
    return inserted
  }

  async update(comunicacao: Comunicacao): Promise<ComunicacaoProps> {
    const data = comunicacao.toJSON()
    await pool.query(
      `
        UPDATE comunicacoes
        SET
          tipo = $2,
          descricao = $3,
          assunto = $4,
          html = $5,
          remetente_id = $6,
          tipo_envio = $7,
          updated_by = $8,
          updated_at = $9
        WHERE id = $1
      `,
      [
        data.id,
        data.tipo,
        data.descricao,
        data.assunto,
        data.html,
        data.remetenteId,
        data.tipoEnvio,
        data.updatedBy,
        data.updatedAt,
      ]
    )
    const updated = await this.findById(data.id)
    if (!updated) {
      throw new Error('Falha ao recuperar comunicação atualizada')
    }
    return updated
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM comunicacoes WHERE id = $1', [id])
  }
}

