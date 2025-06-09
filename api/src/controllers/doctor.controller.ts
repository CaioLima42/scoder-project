import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  HttpStatus,
  UseGuards,
  Query,
  Delete,
  Param
} from '@nestjs/common';
import { Response } from 'express';
import { DoctorBody } from 'src/dtos/create-doctor-body';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/database/prisma.service';
import { ApiKeyGuard } from 'src/guards/logger'; // Certifique-se de usar o nome correto
import * as bcrypt from 'bcrypt';
import { User } from 'src/decorators/user.decorator';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('create')
  async createDoctor(@Body() body: DoctorBody, @Res() res: Response): Promise<any> {
    const { name, age, actingArea, phoneNumber, email, password } = body;

    try {
      const doctor = await this.prisma.doctor.create({
        data: {
          id: randomUUID(),
          name,
          age,
          actingArea,
          phoneNumber,
          email,
          apikey: randomUUID(),
          password: await bcrypt.hash(password, 12),
        },
      });

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Doctor created successfully',
        data: doctor,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating doctor',
        error: error.message,
      });
    }
  }

  @UseGuards(ApiKeyGuard)
  @Get('list-patients')
  async getPatients(
    @Query('name') name: string,
    @User() user: any,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const patients = await this.prisma.patient.findMany({
        where: { name },
      });

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Patients retrieved successfully for Dr. ${user.name}`,
        data: patients,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving patients',
        error: error.message,
      });
    }
  }
  @Delete(':id')
  async deleteDoctor(@Param('id') id: string, @Res() res: Response): Promise<any> {
    try {
      await this.prisma.doctor.delete({
        where: { id },
      });

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Doctor deleted successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error deleting doctor',
        error: error.message,
      });
    }
  }
  @UseGuards(ApiKeyGuard)
  @Get('list')
  async listDoctors(@Res() res: Response): Promise<any> {
    try {
      const doctors = await this.prisma.doctor.findMany({
        select: {
          id: true,
          name: true,
          age: true,
          actingArea: true,
          phoneNumber: true,
          email: true,
        },
      });

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Doctors retrieved successfully',
        data: doctors,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving doctors',
        error: error.message,
      });
    }
  }
}
