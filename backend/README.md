# Bible 365

Uma aplicação web para acompanhamento diário de leitura bíblica, desenvolvida com Flask.

## Índice
- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Desenvolvimento](#desenvolvimento)
- [Documentação](#documentação)
- [Testes](#testes)
- [Deploy](#deploy)
- [Roadmap](#roadmap)

## Visão Geral

Bible 365 é uma aplicação web que permite aos usuários:
- Acompanhar planos de leitura bíblica
- Registrar progresso diário de leituras
- Manter uma sequência (streak) de leituras
- Visualizar estatísticas de progresso
- Autenticar via email/senha ou Google OAuth
- Receber lembretes diários

## Tecnologias

- Python 3.12+
- Flask 3.0+
- PostgreSQL 13
- SQLAlchemy
- Flask-JWT-Extended
- Flask-Migrate
- Flask-Caching
- Flask-Limiter
- Pytest
- Docker
- GitHub Actions

## Funcionalidades

### Autenticação
- Registro local com email/senha
- Login com Google OAuth
- Tokens JWT para autenticação de API
- Rate limiting para proteção contra abusos

### Planos de Leitura
- Plano Gênesis ao Apocalipse em 365 dias
- Tracking de progresso diário
- Sistema de streak para leituras consecutivas
- Histórico de leituras com anotações
- Estatísticas de progresso

### API
- REST API documentada com Swagger
- Rate limiting por IP
- Autenticação via JWT
- Endpoints para todas as funcionalidades

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

### 2. Banco de Dados

```bash
# Setup inicial do banco
flask db init
flask db migrate
flask db upgrade
```

### 3. Docker

```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml up

# Produção
docker-compose up
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
http://localhost:5000/api/v1/docs
```

Documentação detalhada da API também está disponível em `/docs/API.md`.

## Testes

```bash
# Executar todos os testes
pytest

# Com cobertura
pytest --cov=app tests/

# Testes específicos
pytest tests/test_auth.py
pytest tests/test_reading_plans.py
```

Principais áreas cobertas pelos testes:
- Autenticação e registro
- Planos de leitura
- Progressão de leituras
- Validação de dados
- Middleware e utilitários

## Deploy

### 1. Requisitos

- Python 3.12+
- PostgreSQL 13+
- Docker (opcional)

### 2. Produção com Docker

```bash
# Construir imagem
docker build -t bible365 .

# Executar
docker compose up
```

### 3. CI/CD com GitHub Actions

O projeto utiliza GitHub Actions para:
- Executar testes automatizados
- Verificar cobertura de código
- Garantir qualidade do código
- Deploy automático em produção

## Segurança

- Senhas armazenadas com hash seguro
- Rate limiting em endpoints sensíveis
- Proteção contra ataques comuns
- Validação rigorosa de dados
- Testes de segurança automatizados

## Roadmap

### v1.0 - MVP
- [x] Sistema básico de autenticação
- [x] Plano de leitura Gênesis ao Apocalipse
- [x] API REST documentada
- [x] Sistema de streaks
- [x] Testes automatizados

### v1.1
- [ ] Suporte a múltiplas versões bíblicas
- [ ] Sistema de notificações
- [ ] Compartilhamento de progresso
- [ ] Página de perfil do usuário

### v2.0
- [ ] App mobile com React Native
- [ ] Planos de leitura personalizados
- [ ] Sistema de grupos e comunidades
- [ ] Integração com redes sociais