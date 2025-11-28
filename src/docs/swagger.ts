import swaggerJsdoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'API de Comunicações',
    version: '1.0.0',
    description:
      'Documentação do CRUD de remetentes e comunicações seguindo arquitetura SOLID/MVC.\n\n' +
      'Todas as rotas respondem com JSON e estão versionadas sob `/api`.',
  },
  servers: [
    {
      url: 'http://localhost:3334/api',
      description: 'Desenvolvimento local',
    },
  ],
  tags: [
    { name: 'Health', description: 'Status do serviço' },
    { name: 'Remetentes', description: 'Gestão de remetentes de e-mail' },
    { name: 'Comunicações', description: 'Gestão de comunicações' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtido no endpoint /auth/login',
      },
    },
    schemas: {
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
}

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [],
}

export const swaggerSpec = swaggerJsdoc(swaggerOptions)

