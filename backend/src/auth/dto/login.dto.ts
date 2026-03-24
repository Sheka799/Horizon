import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class LoginDto {
	@IsString({ message: 'Email должен быть строкой' })
	@IsEmail({}, { message: 'Некорректный формат email' })
	@IsNotEmpty({ message: 'Email обязательное поле для заполнения' })
	email: string

	@IsString({ message: 'Пароль должен быть строкой' })
	@IsNotEmpty({ message: 'Пароль обязательное поле для заполнения' })
	@MinLength(8, {
		message: 'Пароль должен содержать минимум 8 символов'
	})
	password: string

	@IsOptional()
	@IsString()
	code: string
}