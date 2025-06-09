import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  Get,
  UseGuards,
  Query,
  Delete,
  Param
} from '@nestjs/common';
import { Response } from 'express';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/database/prisma.service';
import { PatientsBody } from 'src/dtos/create-patient-body';
import * as bcrypt from 'bcrypt';
import { ApiKeyGuard } from 'src/guards/logger';
import { User } from 'src/decorators/user.decorator';

@Controller('patient')
export class PatientController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('create')
  async createPatient(
    @Body() body: PatientsBody,
    @Res() res: Response
  ): Promise<any> {
    const { name, age, illness, phoneNumber, email, password } = body;

    try {
      const patient = await this.prisma.patient.create({
        data: {
          id: randomUUID(),
          name,
          age,
          illness,
          phoneNumber,
          email,
          apikey: randomUUID(),
          password: await bcrypt.hash(password, 12),
        },
      });

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Patient created successfully',
        data: patient,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating patient',
        error: error.message,
      });
    }
  }

  @Get('get-consultations')
  @UseGuards(ApiKeyGuard)
  async getConsultations(
    @Query('name') name: string,
    @User() user: any,
    @Res() res: Response
  ): Promise<any> {
    try {
      const patients = await this.prisma.patient.findMany({
        where: { name },
        include: { consultations: true },
      });

      if (patients.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No patient found with the provided name.',
        });
      }

      const consultations = patients.flatMap((p) => p.consultations);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Consultations retrieved successfully for patient '${name}'`,
        data: consultations,
        requestedBy: user?.email,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving consultations',
        error: error.message,
      });
    }
  }
  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  async deletePatient(@Param('id') id: string, @Res() res: Response): Promise<any> {
    try {
      await this.prisma.patient.delete({
        where: { id },
      });

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Patient deleted successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error deleting patient',
        error: error.message,
      });
    }
  }
}
