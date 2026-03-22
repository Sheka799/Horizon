import { ValidatePasswordMatch } from '@/libs/common/decorators/validate-password-match'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	Validate
} from 'class-validator'

export class RegisterDto {
	@IsString({ message: 'Имя должно быть строкой' })
	@IsNotEmpty({ message: 'Имя обязательное поле для заполнения' })
	name: string

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

	@IsString({ message: 'Пароль подтверждения должен быть строкой' })
	@IsNotEmpty({ message: 'Поле подтверждения пароля не может быть пустым' })
	@MinLength(8, {
		message: 'Пароль подтверждения должен содержать минимум 8 символов'
	})
	@Validate(ValidatePasswordMatch, {
		message: 'Пароли не совпадают'
	})
	passwordRepeat: string
}
