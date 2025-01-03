#!/bin/bash

# Aguarda o PostgreSQL iniciar
echo "Waiting for PostgreSQL to start..."
sleep 10

# Executa migrações do banco de dados
echo "Running database migrations..."
flask db upgrade

echo "Build completed!"