FROM node:20

# Cria a pasta do app
WORKDIR /app

# Copia apenas os arquivos de dependências do NestJS
COPY api/package*.json ./api/

# Instala as dependências
WORKDIR /app/api
RUN npm install --omit=dev

# Copia o restante da aplicação NestJS
COPY api/ .

# Compila a aplicação Nest
RUN npm run build

# Expõe a porta da aplicação NestJS
EXPOSE 3000

# Comando para iniciar a aplicação em produção
CMD ["node", "dist/main.js"]
