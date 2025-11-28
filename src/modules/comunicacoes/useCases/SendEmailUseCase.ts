import nodemailer, { type Transporter } from 'nodemailer'
import { AppError } from '../../../core/errors/AppError'
import { decryptPassword } from '../../../core/utils/passwordCipher'
import type { IComunicacaoRepository } from '../repositories/IComunicacaoRepository'
import type { IRemetenteRepository } from '../../remetentes/repositories/IRemetenteRepository'
import type { SendEmailDTO } from '../dto/SendEmailDTO'

export class SendEmailUseCase {
  constructor(
    private comunicacaoRepository: IComunicacaoRepository,
    private remetenteRepository: IRemetenteRepository
  ) {}

  async execute(data: SendEmailDTO): Promise<void> {
    // Buscar comunicação pela chave
    const comunicacao = await this.comunicacaoRepository.findByChave(data.chave)
    if (!comunicacao) {
      throw new AppError('Comunicação não encontrada', 404)
    }

    // Buscar remetente
    const remetente = await this.remetenteRepository.findById(comunicacao.remetenteId)
    if (!remetente) {
      throw new AppError('Remetente não encontrado', 404)
    }

    // Descriptografar senha do remetente
    let senhaDecriptografada: string
    try {
      // Verificar se a senha está em formato bcrypt (hash unidirecional)
      // Se estiver, não pode ser descriptografada - precisa ser recriada com criptografia
      if (remetente.senha.startsWith('$2')) {
        throw new AppError(
          'A senha do remetente está em formato hash (bcrypt) e não pode ser descriptografada. ' +
          'Por favor, atualize a senha do remetente para usar criptografia bidirecional.',
          400
        )
      }
      senhaDecriptografada = decryptPassword(remetente.senha)
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError(
        'Erro ao descriptografar senha do remetente. Verifique se a senha foi salva corretamente.',
        500
      )
    }

    // Substituir variáveis no HTML e assunto
    let htmlProcessado = comunicacao.html
    let assuntoProcessado = comunicacao.assunto

    // Substituir ${VAR1}, ${VAR2}, etc pelas variáveis fornecidas
    data.variaveis.forEach((valor, index) => {
      const variavel = `\${VAR${index + 1}}`
      htmlProcessado = htmlProcessado.replace(new RegExp(this.escapeRegex(variavel), 'g'), valor)
      assuntoProcessado = assuntoProcessado.replace(
        new RegExp(this.escapeRegex(variavel), 'g'),
        valor
      )
    })

    // Configurar transporter do nodemailer
    const transporter: Transporter = nodemailer.createTransport({
      host: remetente.smtpHost,
      port: remetente.smtpPort,
      secure: remetente.smtpSecure, // true para 465, false para outras portas
      auth: {
        user: remetente.email,
        pass: senhaDecriptografada,
      },
    })

    // Preparar anexos se houver
    const attachments = data.anexos?.map((anexo) => ({
      filename: anexo.filename,
      content: Buffer.from(anexo.content, 'base64'),
      contentType: anexo.contentType,
    }))

    // Enviar e-mail
    try {
      await transporter.sendMail({
        from: `"${remetente.nome}" <${remetente.email}>`,
        to: data.destinatario,
        subject: assuntoProcessado,
        html: htmlProcessado,
        attachments: attachments,
      })
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error)
      throw new AppError(
        error instanceof Error ? error.message : 'Erro ao enviar e-mail',
        500
      )
    }
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
}

