FROM node:20

WORKDIR /api

# Copia os arquivos de dependências
COPY api/package*.json ./api/

# Instala dependências
WORKDIR /api
RUN npm install

# Instala o Nest CLI globalmente
RUN npm install -g @nestjs/cli

# Copia o restante da aplicação
COPY api/ .

# Compila o projeto NestJS
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
