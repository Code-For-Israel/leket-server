import {IsString, IsNotEmpty, IsDate, IsOptional} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class UserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsDate()
    @IsOptional()
    created_date: Date;
}
