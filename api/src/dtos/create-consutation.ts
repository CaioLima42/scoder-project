import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class ConstutationBody {
  @IsNotEmpty()
  consultationDate: string;

  @IsNotEmpty()
  @IsString()
  patientName: string;

  @IsNotEmpty()
  @IsString()
  doctorname: string;

  @IsOptional()
  @IsString()
  doctorPhone?: string;

  @IsOptional()
  @IsString()
  patientPhone?: string;

  @IsOptional()
  exams?: any;

  @IsOptional()
  prescription?: any;

  @IsNotEmpty()
  @IsNumber()
  durationMinutes: number;
}
