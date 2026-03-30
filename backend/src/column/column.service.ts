import { prisma } from '@/libs/prisma'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateColumnDto } from './dto/create-column.dto'
import { generateKeyBetween } from 'fractional-indexing'
import { UpdateColumnDto } from './dto/update-column.dto'

@Injectable()
export class ColumnService {
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
				order
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

		return prisma.column.update({
			where: { id: column.id },
			data: {
				...(dto.title && { title: dto.title }),
				order: newOrder
			}
		})
	}
}
