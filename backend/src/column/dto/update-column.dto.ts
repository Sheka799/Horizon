import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateColumnDto {
	@IsString({ message: 'Название колонки должно быть строкой' })
	@IsNotEmpty({ message: 'Название колонки не может быть пустым' })
	@IsOptional()
	title?: string

	@IsString()
	@IsOptional()
	prevOrder?: string | null

	@IsString()
	@IsOptional()
	nextOrder?: string | null
}
