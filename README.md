# Bible 365

Uma aplicação web completa para acompanhamento diário de leitura bíblica.

## 🌟 Visão Geral

Bible 365 é uma aplicação web que permite aos usuários:
- Acompanhar planos de leitura bíblica
- Registrar progresso diário
- Manter um streak de leituras consecutivas
- Visualizar estatísticas de progresso

## 🏗️ Arquitetura

O projeto está dividido em duas partes principais:

### Backend (/backend)
- API REST em Flask
- Banco de dados PostgreSQL
- Autenticação JWT
- Deploy na plataforma Render
- [Documentação detalhada do backend](./backend/README.md)

### Frontend (/frontend)
- Interface web em QwikJS
- Design responsivo
- PWA (Progressive Web App)
- Deploy na plataforma Vercel

## 🚀 URLs do Projeto

- **API**: https://bible365-api.onrender.com
- **Frontend**: https://bible365.vercel.app
- **Documentação API**: https://bible365-api.onrender.com/api/v1/docs

## 🛠️ Tecnologias

### Backend
- Python 3.12+
- Flask 3.0+
- PostgreSQL 13
- SQLAlchemy
- Flask-JWT-Extended

### Frontend
- QwikJS
- TypeScript
- TailwindCSS
- Vite

## 📝 Pré-requisitos

Para desenvolvimento local você precisará:

- Python 3.12+
- Node.js 18+
- PostgreSQL 13+
- Git

## 💻 Desenvolvimento Local

### Backend

```bash
# Entrar no diretório do backend
cd backend

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env

# Rodar migrações
flask db upgrade

# Iniciar servidor de desenvolvimento
flask run
```

### Frontend

```bash
# Entrar no diretório do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🧪 Testes

### Backend

```bash
cd backend
pytest --cov=app tests/
```

### Frontend

```bash
cd frontend
npm run test
```

## 📦 Deploy

O deploy é automático através de CI/CD:

- **Backend**: Push para `main` dispara deploy no Render
- **Frontend**: Push para `main` dispara deploy na Vercel

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- Link do Projeto: [https://github.com/sammarxz/bible365](https://github.com/sammarxz/bible365)
