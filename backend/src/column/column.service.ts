import { prisma } from '@/libs/prisma'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateColumnDto } from './dto/create-column.dto'
import { generateKeyBetween } from 'fractional-indexing'
import { UpdateColumnDto } from './dto/update-column.dto'
import { TaskStatus } from '@prisma/generated/prisma/enums'

@Injectable()
export class ColumnService {
	public async findById(userId: string, id: string) {
		const column = await prisma.column.findFirst({
			where: {
				id,
				board: {
					userId
				}
			},
			include: {
				tasks: {
					orderBy: { order: 'asc' }
				}
			}
		})

		if (!column) {
			throw new NotFoundException('Колонка не найдена')
		}

		return column
	}

	public async delete(userId: string, id: string) {
		const column = await prisma.column.findFirst({
			where: {
				id,
				board: {
					userId
				}
			}
		})

		if (!column) {
			throw new NotFoundException('Колонка не найдена')
		}

		return prisma.column.delete({
			where: { id }
		})
	}

	public async create(userId: string, dto: CreateColumnDto) {
		const board = await prisma.board.findFirst({
			where: {
				id: dto.boardId,
				userId
			}
		})

		if (!board) {
			throw new NotFoundException('Доска не найдена')
		}

		const lastColumn = await prisma.column.findFirst({
			where: { boardId: dto.boardId },
			orderBy: { order: 'desc' }
		})

		const order = generateKeyBetween(lastColumn?.order ?? null, null)

		return prisma.column.create({
			data: {
				title: dto.title,
				boardId: dto.boardId,
				order,
				isDoneColumn: dto.isDoneColumn ?? false
			}
		})
	}

	async update(userId: string, id: string, dto: UpdateColumnDto) {
		const column = await prisma.column.findFirst({
			where: {
				id,
				board: {
					userId
				}
			}
		})

		if (!column) {
			throw new NotFoundException('Колонка не найдена')
		}

		let newOrder = column.order

		if (dto.prevOrder !== undefined || dto.nextOrder !== undefined) {
			newOrder = generateKeyBetween(
				dto.prevOrder ?? null,
				dto.nextOrder ?? null
			)
		}

		// ЕСЛИ МЕНЯЕТСЯ ТИП КОЛОНКИ НА DONE - НУЖНО ОБНОВИТЬ СТАТУСЫ ЗАДАЧ
		if (
			dto.isDoneColumn !== undefined &&
			dto.isDoneColumn !== column.isDoneColumn
		) {
			const newStatus = dto.isDoneColumn
				? TaskStatus.DONE
				: TaskStatus.ACTIVE

			await prisma.task.updateMany({
				where: { columnId: column.id },
				data: {
					status: newStatus,
					completedAt: dto.isDoneColumn ? new Date() : null
				}
			})
		}

		return prisma.column.update({
			where: { id: column.id },
			data: {
				...(dto.title && { title: dto.title }),
				...(dto.isDoneColumn !== undefined && {
					isDoneColumn: dto.isDoneColumn
				}),
				order: newOrder
			}
		})
	}
}
