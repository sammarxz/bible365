# Bible 365 API Documentation

## Visão Geral

A API do Bible 365 fornece acesso programático a todas as funcionalidades da plataforma de leitura bíblica.

## Autenticação

A API usa autenticação JWT (JSON Web Token). Para acessar endpoints protegidos, inclua o token no header:

```
Authorization: Bearer <seu_token>
```

## Rate Limiting

- 200 requisições por dia por IP
- 50 requisições por hora por IP

## Endpoints

### Autenticação

#### POST /api/auth/register
Registra um novo usuário.

**Payload:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### POST /api/auth/login
Realiza login e retorna token JWT.

**Payload:**
```json
{
  "email": "string",
  "password": "string"
}
```

### Bíblia

#### GET /api/bible/books
Retorna lista de todos os livros.

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "Genesis",
    "chapters": 50,
    "testament": "Old"
  }
]
```

### Plano de Leitura

#### POST /api/reading-plan
Cria novo plano de leitura.

**Resposta:**
```json
{
  "plan_id": 1,
  "message": "Reading plan created"
}
```

## Erros

A API usa códigos HTTP padrão:

- 200: Sucesso
- 201: Criado
- 400: Requisição inválida
- 401: Não autorizado
- 403: Proibido
- 404: Não encontrado
- 429: Muitas requisições
- 500: Erro interno