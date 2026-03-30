import { prisma } from '@/libs/prisma'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTaskDto } from './dto/create-task.dto'
import { generateKeyBetween } from 'fractional-indexing'
import { UpdateTaskDto } from './dto/update.task.dto'

@Injectable()
export class TaskService {
	public async getById(userId: string, id: string) {
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

		return prisma.task.create({
			data: {
				name: dto.name,
				columnId: dto.columnId,
				order,
				priority: dto.priority,
				isCompleted: dto.isCompleted ?? false,
				dueDate: dto.dueDate ? new Date(dto.dueDate) : null
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

		return prisma.task.update({
			where: { id },
			data: {
				...(dto.name && { name: dto.name }),
				...(dto.columnId && { columnId: dto.columnId }),
				...(dto.priority !== undefined && { priority: dto.priority }),
				...(dto.isCompleted !== undefined && {
					isCompleted: dto.isCompleted
				}),
				...(dto.dueDate !== undefined && {
					dueDate: dto.dueDate ? new Date(dto.dueDate) : null
				}),
				order:
					dto.prevOrder !== undefined || dto.nextOrder !== undefined
						? generateKeyBetween(
								dto.prevOrder ?? null,
								dto.nextOrder ?? null
							)
						: task.order
			}
		})
	}
}
