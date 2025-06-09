FROM node:20

# Define a pasta onde vai rodar dentro do container, que será /api
WORKDIR /api

# Copia os arquivos package.json e package-lock.json para /api
COPY api/package*.json ./

# Instala as dependências (sem dev)
RUN npm install --omit=dev

# Instala o Nest CLI globalmente
RUN npm install -g @nestjs/cli

# Copia todo o código fonte da pasta api para /api no container
COPY api/ .

# Roda o build para gerar a pasta dist
RUN npm run build

# Expõe a porta 3000 para o container
EXPOSE 3000

# Comando para iniciar a aplicação (no diretório /api)
CMD ["node", "dist/main.js"]
