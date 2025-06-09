FROM node:20

WORKDIR /api

# Copia os arquivos de dependências
COPY api/package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código, incluindo src/prisma/schema.prisma
COPY api/ .

# Gera o Prisma Client a par
