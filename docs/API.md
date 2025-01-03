# Bible 365 API Documentation

## Visão Geral

A API do Bible 365 fornece acesso programático a todas as funcionalidades da plataforma de leitura bíblica. Esta documentação detalha todos os endpoints disponíveis, seus parâmetros e respostas.

## Base URL

```
http://localhost:5000/api/v1
```

## Autenticação

A API usa autenticação JWT (JSON Web Token). Para acessar endpoints protegidos, inclua o token no header:

```
Authorization: Bearer <seu_token>
```

## Rate Limiting

- 200 requisições por dia por IP
- 50 requisições por hora por IP
- 5 tentativas de login por minuto

## Endpoints

### Autenticação

#### POST /auth/register
Registra um novo usuário.

**Payload:**
```json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```

**Resposta (201):**
```json
{
    "message": "User registered successfully"
}
```

#### POST /auth/login
Realiza login e retorna token JWT.

**Payload:**
```json
{
    "email": "string",
    "password": "string"
}
```

**Resposta (200):**
```json
{
    "access_token": "string"
}
```

#### GET /auth/login/google
Inicia o fluxo de autenticação com Google OAuth.

#### GET /auth/login/google/authorized
Callback para autenticação Google OAuth.

### Plano de Leitura

#### POST /reading-plan/start/{plan_type}
Inicia um novo plano de leitura.

**Parâmetros:**
- plan_type (string): Tipo do plano (atualmente suporta apenas "GENESIS_TO_REV")

**Resposta (201):**
```json
{
    "message": "Plano criado com sucesso!",
    "plan_id": 1
}
```

#### GET /reading-plan/current
Obtém detalhes do plano atual do usuário.

**Resposta (200):**
```json
{
    "plan_id": 1,
    "current_day": 1,
    "streak": 0,
    "start_date": "2025-01-03T00:00:00Z",
    "last_read_date": "2025-01-03T00:00:00Z",
    "progress": {
        "total_days": 365,
        "completed_readings": 10,
        "total_readings": 1189,
        "percentage": 0.84
    },
    "todays_readings": [
        {
            "id": 1,
            "book": "Genesis",
            "chapter": 1,
            "completed": false
        }
    ]
}
```

#### POST /reading-plan/complete/{chapter_id}
Marca uma leitura como concluída.

**Resposta (200):**
```json
{
    "message": "Leitura marcada como concluída",
    "progress": {
        "total_days": 365,
        "completed_readings": 11,
        "total_readings": 1189,
        "percentage": 0.92
    }
}
```

#### GET /reading-plan/history
Obtém histórico de leituras do usuário.

**Parâmetros Query:**
- page (int, opcional): Número da página (default: 1)
- per_page (int, opcional): Itens por página (default: 10)

**Resposta (200):**
```json
{
    "readings": [
        {
            "id": 1,
            "book": "Genesis",
            "chapter": 1,
            "completed_at": "2025-01-03T10:30:00Z"
        }
    ],
    "total": 50,
    "pages": 5,
    "current_page": 1,
    "per_page": 10,
    "has_next": true,
    "has_prev": false
}
```

## Códigos de Status

- 200: Sucesso
- 201: Criado
- 400: Requisição inválida
- 401: Não autorizado
- 403: Proibido
- 404: Não encontrado
- 409: Conflito
- 429: Muitas requisições
- 500: Erro interno do servidor

## Erros

Respostas de erro seguem o formato:

```json
{
    "message": "Descrição do erro",
    "status": "Nome do status HTTP"
}
```

## Limitações e Notas

- Um usuário só pode ter um plano de leitura ativo por vez
- O plano "GENESIS_TO_REV" abrange a Bíblia completa em 365 dias
- O streak é mantido ao completar leituras em dias consecutivos
- O streak é resetado se passar mais de um dia sem leituras
- Todas as datas são retornadas em UTC ISO-8601