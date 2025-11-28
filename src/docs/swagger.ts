import swaggerJsdoc from 'swagger-jsdoc'

const remetenteProperties = {
  id: {
    type: 'string',
    format: 'uuid',
    example: '18f9c754-764e-4ea1-9f2c-59fbf5ffc111',
  },
  nome: {
    type: 'string',
    example: 'Remetente Principal',
  },
  email: {
    type: 'string',
    format: 'email',
    example: 'noreply@marshall.com.br',
  },
  senha: {
    type: 'string',
    description: 'Senha criptografada (não retornada nas respostas)',
    example: '***',
  },
  smtpHost: {
    type: 'string',
    example: 'smtp.gmail.com',
  },
  smtpPort: {
    type: 'integer',
    minimum: 1,
    maximum: 65535,
    example: 587,
  },
  smtpSecure: {
    type: 'boolean',
    description: 'Indica se deve usar TLS/SSL',
    example: false,
  },
  createdBy: {
    type: 'string',
    example: 'admin',
  },
  updatedBy: {
    type: 'string',
    example: 'admin',
  },
  createdAt: {
    type: 'string',
    format: 'date-time',
    example: '2025-01-02T10:45:00Z',
  },
  updatedAt: {
    type: 'string',
    format: 'date-time',
    example: '2025-01-02T10:45:00Z',
  },
}

const comunicacaoProperties = {
  id: {
    type: 'string',
    format: 'uuid',
    example: '18f9c754-764e-4ea1-9f2c-59fbf5ffc222',
  },
  tipo: {
    type: 'string',
    enum: ['email'],
    example: 'email',
  },
  descricao: {
    type: 'string',
    example: 'E-mail de redefinição de senha',
  },
  assunto: {
    type: 'string',
    example: 'Redefinição de Senha - Marshall ERP',
  },
  html: {
    type: 'string',
    description: 'Conteúdo HTML do e-mail',
    example: '<html><body><h1>Olá!</h1></body></html>',
  },
  remetenteId: {
    type: 'string',
    format: 'uuid',
    example: '18f9c754-764e-4ea1-9f2c-59fbf5ffc111',
  },
  tipoEnvio: {
    type: 'string',
    enum: ['imediato', 'agendado'],
    example: 'imediato',
    description: 'Tipo de envio (agendado ainda não implementado)',
  },
  chave: {
    type: 'string',
    example: 'email-1704196800000-a1b2c3d4',
    description: 'Chave única gerada automaticamente para identificação',
  },
  createdBy: {
    type: 'string',
    example: 'admin',
  },
  updatedBy: {
    type: 'string',
    example: 'admin',
  },
  createdAt: {
    type: 'string',
    format: 'date-time',
    example: '2025-01-02T10:45:00Z',
  },
  updatedAt: {
    type: 'string',
    format: 'date-time',
    example: '2025-01-02T10:45:00Z',
  },
}

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'API de Comunicações',
    version: '1.0.0',
    description:
      'Documentação do CRUD de remetentes e comunicações seguindo arquitetura SOLID/MVC.\n\n' +
      'Todas as rotas respondem com JSON e estão versionadas sob `/api`.\n\n' +
      '**Autenticação**: Todas as rotas (exceto `/health`) requerem autenticação via JWT Bearer token obtido na API de Usuários.',
  },
  servers: [
    {
      url: 'http://localhost:3334/api',
      description: 'Desenvolvimento local',
    },
  ],
  tags: [
    { name: 'Health', description: 'Status do serviço' },
    { name: 'Remetentes', description: 'Gestão de remetentes de e-mail (SMTP)' },
    { name: 'Comunicações', description: 'Gestão de comunicações (e-mails)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtido no endpoint /auth/login da API de Usuários',
      },
    },
    schemas: {
      Remetente: {
        type: 'object',
        properties: {
          ...remetenteProperties,
          senha: {
            ...remetenteProperties.senha,
            description: 'Senha criptografada (não retornada nas respostas GET)',
          },
        },
      },
      CreateRemetenteInput: {
        type: 'object',
        required: ['nome', 'email', 'senha', 'smtpHost', 'smtpPort', 'smtpSecure', 'createdBy'],
        properties: {
          nome: remetenteProperties.nome,
          email: remetenteProperties.email,
          senha: {
            type: 'string',
            minLength: 6,
            format: 'password',
            description: 'Senha do remetente (será criptografada)',
            example: 'SenhaSegura@123',
          },
          smtpHost: remetenteProperties.smtpHost,
          smtpPort: remetenteProperties.smtpPort,
          smtpSecure: remetenteProperties.smtpSecure,
          createdBy: remetenteProperties.createdBy,
        },
      },
      UpdateRemetenteInput: {
        type: 'object',
        required: ['updatedBy'],
        properties: {
          nome: { ...remetenteProperties.nome, nullable: true },
          email: { ...remetenteProperties.email, nullable: true },
          senha: {
            type: 'string',
            minLength: 6,
            format: 'password',
            nullable: true,
            description: 'Nova senha do remetente (será criptografada)',
            example: 'NovaSenhaSegura@123',
          },
          smtpHost: { ...remetenteProperties.smtpHost, nullable: true },
          smtpPort: { ...remetenteProperties.smtpPort, nullable: true },
          smtpSecure: { ...remetenteProperties.smtpSecure, nullable: true },
          updatedBy: remetenteProperties.updatedBy,
        },
      },
      Comunicacao: {
        type: 'object',
        properties: comunicacaoProperties,
      },
      CreateComunicacaoInput: {
        type: 'object',
        required: ['tipo', 'descricao', 'assunto', 'html', 'remetenteId', 'tipoEnvio', 'createdBy'],
        properties: {
          tipo: comunicacaoProperties.tipo,
          descricao: comunicacaoProperties.descricao,
          assunto: comunicacaoProperties.assunto,
          html: comunicacaoProperties.html,
          remetenteId: comunicacaoProperties.remetenteId,
          tipoEnvio: comunicacaoProperties.tipoEnvio,
          createdBy: comunicacaoProperties.createdBy,
        },
      },
      UpdateComunicacaoInput: {
        type: 'object',
        required: ['updatedBy'],
        properties: {
          tipo: { ...comunicacaoProperties.tipo, nullable: true },
          descricao: { ...comunicacaoProperties.descricao, nullable: true },
          assunto: { ...comunicacaoProperties.assunto, nullable: true },
          html: { ...comunicacaoProperties.html, nullable: true },
          remetenteId: { ...comunicacaoProperties.remetenteId, nullable: true },
          tipoEnvio: { ...comunicacaoProperties.tipoEnvio, nullable: true },
          updatedBy: comunicacaoProperties.updatedBy,
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          message: { type: 'string', example: 'Descrição do erro' },
          details: { type: 'object', nullable: true },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica status da API',
        description: 'Endpoint público para verificar se a API está operante',
        security: [],
        responses: {
          200: {
            description: 'Serviço operante',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/remetentes': {
      get: {
        tags: ['Remetentes'],
        summary: 'Lista remetentes cadastrados',
        description: 'Retorna todos os remetentes de e-mail cadastrados no sistema',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de remetentes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Remetente' },
                },
              },
            },
          },
          401: {
            description: 'Token inválido ou expirado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Remetentes'],
        summary: 'Cria um novo remetente',
        description:
          'Cria um novo remetente de e-mail com as configurações SMTP. A senha será criptografada antes de ser armazenada.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateRemetenteInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Remetente criado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Remetente' },
              },
            },
          },
          400: {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          401: {
            description: 'Token inválido ou expirado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          409: {
            description: 'E-mail já cadastrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/remetentes/{id}': {
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'UUID do remetente',
        },
      ],
      get: {
        tags: ['Remetentes'],
        summary: 'Busca detalhes de um remetente',
        description: 'Retorna os detalhes completos de um remetente específico',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Remetente encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Remetente' },
              },
            },
          },
          401: {
            description: 'Token inválido ou expirado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Remetente não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Remetentes'],
        summary: 'Atualiza um remetente existente',
        description:
          'Atualiza os dados de um remetente. Todos os campos são opcionais, exceto `updatedBy`. Se a senha for fornecida, será criptografada.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateRemetenteInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Remetente atualizado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Remetente' },
              },
            },
          },
          400: {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          401: {
            description: 'Token inválido ou expirado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Remetente não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          409: {
            description: 'E-mail já está em uso por outro remetente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Remetentes'],
        summary: 'Remove um remetente',
        description:
          'Remove um remetente do sistema. Atenção: remetentes que estão sendo usados em comunicações não podem ser removidos.',
        security: [{ bearerAuth: [] }],
        responses: {
          204: {
            description: 'Remetente removido com sucesso',
          },
          401: {
            description: 'Token inválido ou expirado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Remetente não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          409: {
            description: 'Remetente está em uso e não pode ser removido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/comunicacoes': {
      get: {
        tags: ['Comunicações'],
        summary: 'Lista comunicações cadastradas',
        description: 'Retorna todas as comunicações (e-mails) cadastradas no sistema',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de comunicações',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Comunicacao' },
                },
              },
            },
          },
          401: {
            description: 'Token inválido ou expirado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Comunicações'],
        summary: 'Cria uma nova comunicação',
        description:
          'Cria uma nova comunicação (e-mail). Uma chave única será gerada automaticamente no formato: `{tipo}-{timestamp}-{uuid}`.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateComunicacaoInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Comunicação criada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Comunicacao' },
              },
            },
          },
          400: {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          401: {
            description: 'Token inválido ou expirado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Remetente não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/comunicacoes/{id}': {
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'UUID da comunicação',
        },
      ],
      get: {
        tags: ['Comunicações'],
        summary: 'Busca detalhes de uma comunicação',
        description: 'Retorna os detalhes completos de uma comunicação específica, incluindo o HTML',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Comunicação encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Comunicacao' },
              },
            },
          },
          401: {
            description: 'Token inválido ou expirado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Comunicação não encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Comunicações'],
        summary: 'Atualiza uma comunicação existente',
        description:
          'Atualiza os dados de uma comunicação. Todos os campos são opcionais, exceto `updatedBy`.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateComunicacaoInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Comunicação atualizada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Comunicacao' },
              },
            },
          },
          400: {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          401: {
            description: 'Token inválido ou expirado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Comunicação ou remetente não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Comunicações'],
        summary: 'Remove uma comunicação',
        description: 'Remove uma comunicação do sistema',
        security: [{ bearerAuth: [] }],
        responses: {
          204: {
            description: 'Comunicação removida com sucesso',
          },
          401: {
            description: 'Token inválido ou expirado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Comunicação não encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
}

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [],
}

export const swaggerSpec = swaggerJsdoc(swaggerOptions)

