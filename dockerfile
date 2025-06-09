FROM node:20

WORKDIR /api

# Copia os arquivos de dependências
COPY api/package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código, incluindo src/prisma/schema.prisma
COPY api/ .

# Gera o Prisma Client a partir do schema dentro de src/prisma
RUN npx prisma generate --schema=./src/prisma/schema.prisma

# Compila o projeto
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
