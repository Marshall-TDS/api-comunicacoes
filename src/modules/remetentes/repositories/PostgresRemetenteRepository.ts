import { pool } from '../../../infra/database/pool'
import type { Remetente, RemetenteProps } from '../entities/Remetente'
import type { IRemetenteRepository } from './IRemetenteRepository'

type RemetenteRow = {
  id: string
  seq_id: string
  nome: string
  email: string
  senha: string
  smtp_host: string
  smtp_port: number
  smtp_secure: boolean
  created_by: string
  updated_by: string
  created_at: Date
  updated_at: Date
}

const mapRowToProps = (row: RemetenteRow): RemetenteProps => ({
  id: row.id,
  seqId: row.seq_id ? parseInt(row.seq_id, 10) : undefined,
  nome: row.nome,
  email: row.email,
  senha: row.senha,
  smtpHost: row.smtp_host,
  smtpPort: row.smtp_port,
  smtpSecure: row.smtp_secure,
  createdBy: row.created_by,
  updatedBy: row.updated_by,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export class PostgresRemetenteRepository implements IRemetenteRepository {
  async findAll(): Promise<RemetenteProps[]> {
    const result = await pool.query<RemetenteRow>(
      'SELECT id, seq_id, nome, email, senha, smtp_host, smtp_port, smtp_secure, created_by, updated_by, created_at, updated_at FROM remetentes ORDER BY nome ASC'
    )
    return result.rows.map(mapRowToProps)
  }

  async findById(id: string): Promise<RemetenteProps | null> {
    const result = await pool.query<RemetenteRow>(
      'SELECT id, seq_id, nome, email, senha, smtp_host, smtp_port, smtp_secure, created_by, updated_by, created_at, updated_at FROM remetentes WHERE id = $1',
      [id]
    )
    const row = result.rows[0]
    return row ? mapRowToProps(row) : null
  }

  async findByEmail(email: string): Promise<RemetenteProps | null> {
    const result = await pool.query<RemetenteRow>(
      'SELECT id, seq_id, nome, email, senha, smtp_host, smtp_port, smtp_secure, created_by, updated_by, created_at, updated_at FROM remetentes WHERE LOWER(email) = LOWER($1)',
      [email]
    )
    const row = result.rows[0]
    return row ? mapRowToProps(row) : null
  }

  async create(remetente: Remetente): Promise<RemetenteProps> {
    const data = remetente.toJSON()
    await pool.query(
      `
        INSERT INTO remetentes (
          id, nome, email, senha, smtp_host, smtp_port, smtp_secure,
          created_by, updated_by, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `,
      [
        data.id,
        data.nome,
        data.email,
        data.senha,
        data.smtpHost,
        data.smtpPort,
        data.smtpSecure,
        data.createdBy,
        data.updatedBy,
        data.createdAt,
        data.updatedAt,
      ]
    )
    const inserted = await this.findById(data.id)
    if (!inserted) {
      throw new Error('Falha ao recuperar remetente inserido')
    }
    return inserted
  }

  async update(remetente: Remetente): Promise<RemetenteProps> {
    const data = remetente.toJSON()
    await pool.query(
      `
        UPDATE remetentes
        SET
          nome = $2,
          email = $3,
          senha = $4,
          smtp_host = $5,
          smtp_port = $6,
          smtp_secure = $7,
          updated_by = $8,
          updated_at = $9
        WHERE id = $1
      `,
      [
        data.id,
        data.nome,
        data.email,
        data.senha,
        data.smtpHost,
        data.smtpPort,
        data.smtpSecure,
        data.updatedBy,
        data.updatedAt,
      ]
    )
    const updated = await this.findById(data.id)
    if (!updated) {
      throw new Error('Falha ao recuperar remetente atualizado')
    }
    return updated
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM remetentes WHERE id = $1', [id])
  }
}

