# API de Comunicações

API para gerenciamento de remetentes e comunicações seguindo arquitetura SOLID/MVC em TypeScript.

## Estrutura

- **Remetentes**: CRUD completo para gerenciamento de remetentes de e-mail com configurações SMTP
- **Comunicações**: CRUD completo para gerenciamento de comunicações (por enquanto apenas e-mail)

## Tecnologias

- Express.js
- TypeScript
- PostgreSQL
- Zod (validação)
- bcryptjs (criptografia de senhas)

## Configuração

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente (criar arquivo `.env`):
```
NODE_ENV=development
PORT=3334
DB_HOST=localhost
DB_PORT=5432
DB_NAME=marshall
DB_USER=developer
DB_PASS=
JWT_SECRET=default-jwt-secret
JWT_EXPIRES_IN=2h
CRYPTO_SECRET=default-crypto-secret
API_USUARIOS_URL=http://localhost:3333/api
```

**Importante**: A variável `JWT_SECRET` deve ser a mesma usada na `api-usuarios` para que os tokens sejam válidos em ambas as APIs. A variável `API_USUARIOS_URL` é usada para validar se o token está ativo na API de usuários.

3. Executar migrations no projeto `db-migrations`

4. Executar em desenvolvimento:
```bash
npm run dev
```

## Rotas

### Remetentes
- `GET /api/remetentes` - Lista todos os remetentes
- `GET /api/remetentes/:id` - Busca um remetente por ID
- `POST /api/remetentes` - Cria um novo remetente
- `PUT /api/remetentes/:id` - Atualiza um remetente
- `DELETE /api/remetentes/:id` - Remove um remetente

### Comunicações
- `GET /api/comunicacoes` - Lista todas as comunicações
- `GET /api/comunicacoes/:id` - Busca uma comunicação por ID
- `POST /api/comunicacoes` - Cria uma nova comunicação
- `PUT /api/comunicacoes/:id` - Atualiza uma comunicação
- `DELETE /api/comunicacoes/:id` - Remove uma comunicação

## Autenticação

Todas as rotas (exceto `/api/health`) requerem autenticação via JWT Bearer token.

A API de comunicações valida os tokens da seguinte forma:
1. **Validação local**: Verifica a assinatura e expiração do token usando o mesmo `JWT_SECRET` da API de usuários
2. **Validação na API de usuários**: Faz uma requisição para a API de usuários para garantir que o token está ativo

Isso garante que apenas tokens válidos e ativos na API de usuários possam ser usados na API de comunicações.

## Documentação

Acesse `/docs` para ver a documentação Swagger da API.

