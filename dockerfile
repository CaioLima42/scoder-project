FROM node:20

# Define a raiz do projeto
WORKDIR /app

# Copia os arquivos de dependência do Nest (dentro da pasta api/)
COPY api/package*.json ./api/

# Instala as dependências dentro da subpasta /app/api
WORKDIR /app/api
RUN npm install

# Copia todo o conteúdo da pasta api/
COPY api/ .

# Faz o build do projeto NestJS
RUN npm run build

# Expõe a porta usada pelo NestJS
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"]
