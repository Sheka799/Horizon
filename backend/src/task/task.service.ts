import { prisma } from '@/libs/prisma'
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { CreateTaskDto } from './dto/create-task.dto'
import { generateKeyBetween } from 'fractional-indexing'
import { UpdateTaskDto } from './dto/update.task.dto'
import { TaskStatus } from '@prisma/generated/prisma/enums'
import { TaskAttachmentService } from '@/task-attachment/task-attachment.service'
import { ConfigService } from '@nestjs/config'
import { validateTaskDescription } from './utils/validate-task-description.util'

@Injectable()
export class TaskService {
	public constructor(
		private readonly taskAttachmentService: TaskAttachmentService,
		private readonly configService: ConfigService
	) {}

	public async getById(userId: string, id: string) {
		const task = await prisma.task.findFirst({
			where: {
				id,
				column: {
					board: {
						userId
					}
				}
			},
			include: {
				attachments: true
			}
		})

		if (!task) {
			throw new NotFoundException('Задача не найдена')
		}

		return task
	}

	public async delete(userId: string, id: string) {
		const task = await prisma.task.findFirst({
			where: {
				id,
				column: {
					board: {
						userId
					}
				}
			}
		})

		if (!task) {
			throw new NotFoundException('Задача не найдена')
		}

		await this.taskAttachmentService.removeAllForTask(id)

		return prisma.task.delete({
			where: { id }
		})
	}

	public async create(userId: string, dto: CreateTaskDto) {
		const column = await prisma.column.findFirst({
			where: {
				id: dto.columnId,
				board: {
					userId
				}
			}
		})

		if (!column) {
			throw new NotFoundException('Колонка не найдена')
		}

		const lastTask = await prisma.task.findFirst({
			where: { columnId: dto.columnId },
			orderBy: { order: 'desc' }
		})

		const order = generateKeyBetween(lastTask?.order ?? null, null)

		const isDone = column.isDoneColumn
		const status = isDone ? TaskStatus.DONE : TaskStatus.ACTIVE

		return prisma.task.create({
			data: {
				name: dto.name,
				columnId: dto.columnId,
				order,
				priority: dto.priority,
				dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
				status,
				isArchived: false,
				completedAt: isDone ? new Date() : null,
				archivedAt: null
			}
		})
	}

	public async update(userId: string, id: string, dto: UpdateTaskDto) {
		const task = await prisma.task.findFirst({
			where: {
				id,
				column: {
					board: {
						userId
					}
				}
			}
		})

		if (!task) {
			throw new NotFoundException('Задача не найдена')
		}

		let status = task.status
		let completedAt = task.completedAt

		if (dto.columnId && dto.columnId !== task.columnId) {
			const targetColumn = await prisma.column.findFirst({
				where: {
					id: dto.columnId,
					board: { userId }
				}
			})

			if (!targetColumn) {
				throw new NotFoundException('Колонка не найдена')
			}

			status = targetColumn.isDoneColumn
				? TaskStatus.DONE
				: TaskStatus.ACTIVE
			completedAt = targetColumn.isDoneColumn ? new Date() : null
		}

		let isArchived = task.isArchived
		let archivedAt = task.archivedAt

		if (
			dto.isArchived !== undefined &&
			dto.isArchived !== task.isArchived
		) {
			isArchived = dto.isArchived
			archivedAt = dto.isArchived ? new Date() : null
		}

		const description = this.resolveDescription(task, dto)

		return prisma.task.update({
			where: { id },
			data: {
				...(dto.name && { name: dto.name }),
				...(dto.columnId && { columnId: dto.columnId }),
				...(dto.priority !== undefined && { priority: dto.priority }),
				...(dto.dueDate !== undefined && {
					dueDate: dto.dueDate ? new Date(dto.dueDate) : null
				}),
				description: description as any,
				order:
					dto.prevOrder !== undefined || dto.nextOrder !== undefined
						? generateKeyBetween(
								dto.prevOrder ?? null,
								dto.nextOrder ?? null
							)
						: task.order,
				status,
				isArchived,
				completedAt,
				archivedAt
			}
		})
	}

	private resolveDescription(
		task: { description: unknown },
		dto: UpdateTaskDto
	): unknown {
		if (dto.description === undefined) {
			return task.description
		}

		if (dto.description === null) {
			return null
		}

		try {
			return validateTaskDescription(
				dto.description,
				this.configService.getOrThrow<string>('S3_URL')
			)
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Некорректное описание'
			throw new BadRequestException(message)
		}
	}
}
