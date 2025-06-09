FROM node:20

WORKDIR /api

# Copia os arquivos de dependência
COPY api/package*.json ./

# Instala dependências
RUN npm install

# Copia tudo da pasta `api`
COPY api/ .

# Gera o Prisma Client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Compila o projeto NestJS
RUN npm run build

# Expondo a porta
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/main.js"]
