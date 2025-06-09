import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/database/prisma.service';

describe('ConsultationController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Criar dados de teste: paciente e doutor
    await prisma.doctor.create({
      data: {
        id: 'doctor-1',
        name: 'Dr. Teste',
        age: 45,
        actingArea: 'Cardiology',
        email: 'doctor@example.com',
        phoneNumber: '123456789',
        apikey: 'apikey-doctor',
        password: 'senha123'
      }
    });

    await prisma.patient.create({
      data: {
        id: 'patient-1',
        name: 'Paciente Teste',
        age: '30',
        illness: ['Diabetes'],
        email: 'paciente@example.com',
        phoneNumber: '987654321',
        apikey: 'apikey-paciente',
        password: 'senha456'
      }
    });
  });

  afterAll(async () => {
    await prisma.consultation.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.doctor.deleteMany();
    await app.close();
  });

  it('deve criar uma consulta com sucesso', async () => {
    const response = await request(app.getHttpServer())
      .post('/consultation/create')
      .send({
        consultationDate: new Date().toISOString(),
        doctorname: 'Dr. Teste',
        doctorPhone: '123456789',
        patientName: 'Paciente Teste',
        patientPhone: '987654321'
      });

    expect(response.status).toBe(201);
    expect(response.body.consultation).toHaveProperty('id');
    expect(response.body.message).toBe('Consultation created successfully');
  });
});
