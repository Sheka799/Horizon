import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class NewPasswordDto {
    @IsString({message: 'Пароль должен быть строкой'})
    @IsNotEmpty({message: 'Пароль обязательное поле для заполнения'})
    @MinLength(8, {
        message: 'Пароль должен содержать минимум 8 символов'
    })
    password: string
}