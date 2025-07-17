#!/bin/bash

# Lê a variável NEXT_PUBLIC_SITE_URL do arquivo .env
NEXT_PUBLIC_SITE_URL=$(grep NEXT_PUBLIC_SITE_URL .env | cut -d '=' -f2-)

# Remove possíveis aspas e espaços
NEXT_PUBLIC_SITE_URL=$(echo $NEXT_PUBLIC_SITE_URL | tr -d '"' | xargs)

# Verifica se a variável foi encontrada
if [ -z "$NEXT_PUBLIC_SITE_URL" ]; then
  echo "Erro: NEXT_PUBLIC_SITE_URL não encontrada no .env"
  exit 1
fi

# Inicia o Netlify Dev em foreground, sem abrir o navegador
netlify dev --no-open &

NETLIFY_PID=$!

# Aguarda alguns segundos para garantir que o servidor subiu
sleep 5

# Abre o navegador na URL do ngrok (vinda do .env)
open "$NEXT_PUBLIC_SITE_URL"

# Espera o Netlify Dev terminar (Ctrl+C encerra tudo)
wait $NETLIFY_PID