# Clínica API - Documentação

Este projeto é uma API RESTful desenvolvida com [NestJS](https://nestjs.com/) e Prisma ORM, conectada a um banco de dados PostgreSQL. Ele gerencia médicos, pacientes, consultas, exames e prescrições.

---

### 🔧 Tecnologias Utilizadas

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Bcrypt (para hash de senha)
- API Key Guard (autenticação)

---



### 🔑 Autenticação

Algumas rotas estão protegidas com autenticação baseada em **API Key**, que deve ser enviada no header:


### 🐳 Executando a Aplicação com Docker Compose
Pré-requisitos
Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.

## Compile e suba os serviços (Postgres + Nest API):
```
docker-compose up --build
```
## A API estará disponível em:
```
http://localhost:3000
```
## Rotas:

🩺 Doctor:
```
POST /doctor/create
Descrição: Cria um novo médico.

Body:

json
Copiar
Editar
{
  "name": "Nome",
  "age": 40,
  "actingArea": "Cardiologia",
  "email": "email@exemplo.com",
  "phoneNumber": "11999999999",
  "password": "senha123"
}
```
```
GET /doctor/list-patients?name=João
Descrição: Lista pacientes com o nome especificado.

Requer API Key
```
```
DELETE /doctor/:id
Descrição: Deleta um médico pelo ID.

Requer API Key
```
👤 PatientController
```
POST /patient/create
Descrição: Cria um novo paciente.

Body:

json
Copiar
Editar
{
  "name": "Maria",
  "age": "30",
  "illness": ["diabetes", "hipertensão"],
  "email": "maria@exemplo.com",
  "phoneNumber": "11988888888",
  "password": "senha123"
}
```
```
GET /patient/get-consultations?name=Maria
Descrição: Retorna todas as consultas do paciente especificado.

Requer API Key
```
```
DELETE /patient/:id
Descrição: Deleta um paciente pelo ID.

Requer API Key
```

📅 ConsultationController
```
POST /consultation/create
Descrição: Cria uma nova consulta médica.

Body:

json
Copiar
Editar
{
  "consultationDate": "2025-06-09T10:00:00Z",
  "durationMinutes": 60,
  "doctorname": "Dr. João",
  "doctorPhone": "11999999999",
  "patientName": "Maria",
  "patientPhone": "11988888888",
  "exams": "Exame de sangue",
  "prescription": "Tomar remédio X"
}
```
```
PATCH /consultation/reschedule/:id
Descrição: Reagenda uma consulta existente.

Body:

json
Copiar
Editar
{
  "consultationDate": "2025-06-10T15:00:00Z",
  "durationMinutes": 45
}
```
```
DELETE /consultation/:id
Descrição: Deleta uma consulta pelo ID.
```
