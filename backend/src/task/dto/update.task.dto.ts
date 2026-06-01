import {
	IsBoolean,
	IsDateString,
	IsEnum,
	IsOptional,
	IsString
} from 'class-validator'
import { Priority, TaskStatus } from '@prisma/generated/prisma/enums'

export class UpdateTaskDto {
	@IsString({ message: 'Название должно быть строкой' })
	@IsOptional()
	name?: string

	@IsString({ message: 'ID колонки должно быть строкой' })
	@IsOptional()
	columnId?: string

	@IsEnum(Priority, { message: 'Неверный приоритет' })
	@IsOptional()
	priority?: Priority

	@IsDateString({}, { message: 'Неверный формат даты' })
	@IsOptional()
	dueDate?: string

	@IsOptional()
	prevOrder?: string | null

	@IsOptional()
	nextOrder?: string | null

	@IsEnum(TaskStatus, { message: 'Неверный статус' })
	@IsOptional()
	status?: TaskStatus

	@IsBoolean({ message: 'isArchived должно быть булевым' })
	@IsOptional()
	isArchived?: boolean
}
