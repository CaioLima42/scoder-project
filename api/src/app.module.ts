import { Module } from '@nestjs/common';
import { DoctorController } from './controllers/doctor.controller';
import { PatientController } from './controllers/patient.controller';

import { PrismaModule } from './database/prisma.module';
import { ApiKeyGuard } from './guards/logger';

@Module({
  imports: [PrismaModule], // <- aqui você importa o módulo que já exporta PrismaService
  controllers: [DoctorController, PatientController],
  providers: [ApiKeyGuard], // Se necessário
})
export class AppModule {}