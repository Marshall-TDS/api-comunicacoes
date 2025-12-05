# ⚙️ Configuração do Servidor

## Informações do Servidor de Deploy

- **IP**: `72.61.223.230`
- **Servidor**: VPS Hostinger
- **Diretório de Deploy**: `/var/www/api-comunicacoes`

## Portas Configuradas

- **Homologação (homolog)**: Porta `5334`
- **Produção (main)**: Porta `3334`

## GitHub Actions Secrets Necessárias

Configure as seguintes secrets no GitHub (Settings → Secrets and variables → Actions):

### Secrets de Infraestrutura:
| Secret | Valor |
|--------|-------|
| `VPS_SSH_PRIVATE_KEY` | Chave SSH privada para acesso ao servidor |
| `VPS_HOST` | `72.61.223.230` |
| `VPS_USER` | Usuário SSH (ex: `root` ou seu usuário) |
| `VPS_DEPLOY_PATH` | `/var/www/api-comunicacoes` |

### Secrets de Banco de Dados:
| Secret | Descrição |
|--------|-----------|
| `DB_HOST` | Host do banco de dados PostgreSQL |
| `DB_PORT` | Porta do banco (geralmente `5432`) |
| `DB_NAME_HOMOLOG` | Nome do banco de homologação |
| `DB_NAME_MAIN` | Nome do banco de produção |
| `DB_USER` | Usuário do banco de dados |
| `DB_PASS` | Senha do banco de dados |

### Secrets de Aplicação:
| Secret | Descrição |
|--------|-----------|
| `APP_WEB_URL_HOMOLOG` | URL da aplicação web para homologação |
| `APP_WEB_URL_MAIN` | URL da aplicação web para produção |
| `API_USUARIOS_URL_HOMOLOG` | URL da API de usuários para homologação |
| `API_USUARIOS_URL_MAIN` | URL da API de usuários para produção |

### Secrets de Segurança:
| Secret | Descrição |
|--------|-----------|
| `JWT_SECRET` | Chave secreta para JWT |
| `JWT_EXPIRES_IN` | Tempo de expiração do JWT (ex: `2h`) |
| `CRYPTO_SECRET` | Chave secreta para criptografia |

**Nota**: Todas as variáveis de ambiente são configuradas como secrets no GitHub Actions. Não é necessário criar arquivo `.env` no servidor.

## Comandos Rápidos

### Conectar ao servidor
```bash
ssh seu-usuario@72.61.223.230
```

### Verificar containers
```bash
ssh seu-usuario@72.61.223.230 "cd /var/www/api-comunicacoes && docker-compose ps"
```

### Ver logs de homologação
```bash
ssh seu-usuario@72.61.223.230 "cd /var/www/api-comunicacoes && docker-compose logs -f api-comunicacoes-homolog"
```

### Ver logs de produção
```bash
ssh seu-usuario@72.61.223.230 "cd /var/www/api-comunicacoes && docker-compose logs -f api-comunicacoes-main"
```

### Testar API de homologação
```bash
curl http://72.61.223.230:5334/api/health
```

### Testar API de produção
```bash
curl http://72.61.223.230:3334/api/health
```

