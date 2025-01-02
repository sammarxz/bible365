# Bible 365

Uma aplicação web para acompanhamento diário de leitura bíblica, desenvolvida com Flask.

## Índice
- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Desenvolvimento](#desenvolvimento)
- [Documentação](#documentacao)
- [API](#api)
- [Testes](#testes)
- [Deploy](#deploy)

## Visão Geral

Bible 365 é uma aplicação web que permite aos usuários:
- Acompanhar planos de leitura bíblica
- Consultar diferentes versões da Bíblia
- Registrar anotações e marcadores
- Compartilhar progresso
- Receber lembretes diários

## Tecnologias

- Python 3.11+
- Flask 3.0+
- PostgreSQL
- SQLAlchemy
- Flask-JWT-Extended
- Flask-Migrate
- Pytest
- Docker
- GitHub Actions

## Desenvolvimento

### 1. Setup do Ambiente

```bash
# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
```

### 2. Estrutura do Projeto

```g
bible365/
├── app/
│   ├── models/      # Modelos do banco de dados
│   ├── api/         # Endpoints da API
│   ├── services/    # Lógica de negócio
│   └── utils/       # Utilitários
├── tests/           # Testes unitários/integração
└── docs/           # Documentação adicional
```

### 3. Banco de Dados

```bash
# Criar banco de dados
flask db init
flask db migrate
flask db upgrade
```

### 4. Executar Localmente

```bash
# Modo desenvolvimento
flask run

# Modo debug
flask run --debug
```

## Documentação

A documentação da API está disponível via Swagger UI em:

```
http://localhost:5000/api/docs
```

Para acessar:

1. Inicie a aplicação
2. Navegue até `/api/docs` no seu navegador
3. Explore os endpoints disponíveis
4. Teste as requisições diretamente pela interface

A documentação inclui:
- Descrição de todos os endpoints
- Schemas de request/response
- Autenticação necessária
- Exemplos de uso

## API

### Autenticação
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Bíblia
- `GET /api/bible/versions` - Lista versões
- `GET /api/bible/books` - Lista livros
- `GET /api/bible/chapters/{book}` - Lista capítulos

### Plano de Leitura
- `GET /api/reading-plan/` - Lista planos
- `POST /api/reading-plan/start` - Inicia plano
- `PUT /api/reading-plan/progress` - Atualiza progresso

## Testes

```bash
# Executar testes
pytest

# Com cobertura
pytest --cov=app tests/
```

## Deploy

### 1. Docker

```bash
# Construir imagem
docker build -t bible365 .

# Executar container
docker run -p 5000:5000 bible365
```

### 2. CI/CD com GitHub Actions

- Push na main inicia pipeline
- Executa testes
- Análise de código
- Deploy automático no Heroku/DigitalOcean

### 3. Produção

Checklist pré-deploy:
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados migrado
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Monitoramento configurado

## Roadmap

- v1.0 - MVP com funcionalidades básicas
- v1.1 - Suporte a múltiplas versões bíblicas
- v1.2 - Sistema de notificações
- v2.0 - App mobile