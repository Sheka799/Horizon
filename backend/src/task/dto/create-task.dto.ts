import {
	IsBoolean,
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString
} from 'class-validator'
import { Priority, TaskStatus } from '@prisma/generated/prisma/enums'

export class CreateTaskDto {
	@IsString({ message: 'Название должно быть строкой' })
	@IsNotEmpty({ message: 'Название не может быть пустым' })
	name: string = ''

	@IsString({ message: 'ID колонки должно быть строкой' })
	@IsNotEmpty({ message: 'ID колонки обязательно' })
	columnId: string = ''

	@IsEnum(Priority, { message: 'Неверный приоритет' })
	@IsOptional()
	priority?: Priority

	@IsDateString({}, { message: 'Неверный формат даты' })
	@IsOptional()
	dueDate?: string

	@IsEnum(TaskStatus, { message: 'Неверный статус' })
	@IsOptional()
	status?: TaskStatus

	@IsBoolean({ message: 'isArchived должно быть булевым' })
	@IsOptional()
	isArchived?: boolean
}
