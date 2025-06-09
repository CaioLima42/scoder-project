import {IsNotEmpty} from 'class-validator'

export class findMember{
    @IsNotEmpty()
    name: string;
}