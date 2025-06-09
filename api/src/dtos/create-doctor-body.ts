import {IsNotEmpty, IsEmail, IsInt} from 'class-validator';

export class DoctorBody{
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @IsInt()
    age: number;
    @IsNotEmpty()
    actingArea: string;
    @IsNotEmpty()
    phoneNumber: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
}