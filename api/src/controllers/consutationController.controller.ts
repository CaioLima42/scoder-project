import { Body, Controller, HttpStatus, Post, Patch, Delete, Param, Res, UseGuards } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/database/prisma.service';
import { ConstutationBody } from 'src/dtos/create-consutation';
import { Response } from 'express';

@Controller('consultation')
export class ConsutationController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('create')
  async createConsultation(
    @Body() body: ConstutationBody,
    @Res() res: Response
  ): Promise<any> {
    const {
      consultationDate,
      patientName,
      doctorname,
      doctorPhone,
      patientPhone,
      exams,
      prescription,
      durationMinutes
    } = body;

    if (!durationMinutes || typeof durationMinutes !== 'number') {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'You must provide the duration of the consultation in minutes.'
      });
    }

    let doctors = await this.prisma.doctor.findMany({ where: { name: doctorname } });

    if (doctors.length > 1) {
      if (!doctorPhone) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Too many doctors with the same name, please send the phone number as well.'
        });
      }

      const doctorByPhone = await this.prisma.doctor.findFirst({
        where: { name: doctorname, phoneNumber: doctorPhone }
      });

      if (!doctorByPhone) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'No doctor found with the provided name and phone number.'
        });
      }

      doctors = [doctorByPhone];
    }

    const doctor = doctors[0];

    let patients = await this.prisma.patient.findMany({ where: { name: patientName } });

    if (patients.length > 1) {
      if (!patientPhone) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Too many patients with the same name, please send the phone number as well.'
        });
      }

      const patientByPhone = await this.prisma.patient.findFirst({
        where: { name: patientName, phoneNumber: patientPhone }
      });

      if (!patientByPhone) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'No patient found with the provided name and phone number.'
        });
      }

      patients = [patientByPhone];
    }

    const patient = patients[0];
    const startTime = new Date(consultationDate);
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    const overlappingConsultation = await this.prisma.consultation.findFirst({
      where: {
        doctorId: doctor.id,
        OR: [
          {
            consultationDate: {
              gte: startTime,
              lt: endTime
            }
          },
          {
            AND: [
              {
                consultationDate: {
                  lte: startTime
                }
              },
              {
                durationMinutes: {
                  gt: Math.floor((startTime.getTime() - new Date().getTime()) / 60000)
                }
              }
            ]
          }
        ]
      }
    });

    if (overlappingConsultation) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'This doctor already has a consultation scheduled during this time.'
      });
    }
    const data: any = {
      id: randomUUID(),
      consultationDate,
      doctorName: doctor.id,
      patientName: patient.id,
    };

    if (exams) {
      data.exams = exams;
    }
    if (prescription) {
      data.prescription = prescription;
    }

    const consultation = await this.prisma.consultation.create({
      data
    });

    return res.status(HttpStatus.CREATED).json({
      message: 'Consultation created successfully',
      consultation
    });
  }

  @Patch('reschedule/:id')
  async rescheduleConsultation(
    @Param('id') id: string,
    @Body() body: { consultationDate: string; durationMinutes: number },
    @Res() res: Response
  ): Promise<any> {
    const { consultationDate, durationMinutes } = body;

    if (!consultationDate || !durationMinutes) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'New consultation date and duration are required.',
      });
    }

    const existing = await this.prisma.consultation.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Consultation not found.',
      });
    }

    const startTime = new Date(consultationDate);
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    const overlapping = await this.prisma.consultation.findFirst({
      where: {
        id: { not: id },
        doctorId: existing.doctorId,
        OR: [
          {
            consultationDate: {
              gte: startTime,
              lt: endTime,
            },
          },
          {
            AND: [
              {
                consultationDate: {
                  lte: startTime,
                },
              },
              {
                durationMinutes: {
                  gt: Math.floor((startTime.getTime() - new Date().getTime()) / 60000),
                },
              },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Doctor has another consultation scheduled during this time.',
      });
    }

    const updated = await this.prisma.consultation.update({
      where: { id },
      data: {
        consultationDate: startTime,
        durationMinutes,
      },
    });

    return res.status(HttpStatus.OK).json({
      message: 'Consultation rescheduled successfully.',
      consultation: updated,
    });
  }
  
  @Delete(':id')
  async deleteConsultation(
    @Param('id') id: string,
    @Res() res: Response
  ): Promise<any> {
    const existing = await this.prisma.consultation.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Consultation not found.',
      });
    }

    await this.prisma.consultation.delete({
      where: { id },
    });

    return res.status(HttpStatus.OK).json({
      message: 'Consultation deleted successfully.',
    });
  }
}
