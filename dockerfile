FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /api

# Copia os arquivos de dependência
COPY api/package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante da aplicação
COPY api/ .

# Gera Prisma Client apontando para o schema correto
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Compila o projeto NestJS
RUN npm run build

# Expõe a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"]
