import {IsEmail, IsNotEmpty} from 'class-validator'

export class PatientsBody{
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    age: string;
    @IsNotEmpty()
    illness: string[];
    @IsNotEmpty()
    doctorName: string;
    @IsNotEmpty()
    phoneNumber;
    @IsNotEmpty()
    @IsEmail()
    email: string
    @IsNotEmpty()
    password: string;
}