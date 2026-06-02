import { prisma } from '@/libs/prisma'
import { Injectable, NotFoundException } from '@nestjs/common'
import { generateKeyBetween } from 'fractional-indexing'
import { UpdateBoardDto } from './dto/update-board.dto'
import { CreateBoardDto } from './dto/create-board.dto'

@Injectable()
export class BoardService {
	public async findAll(userId: string) {
		const boards = await prisma.board.findMany({
			where: {
				userId
			},
			orderBy: { createdAt: 'desc' }
		})

		return boards
	}

	public async findById(userId: string, id: string) {
		const board = await prisma.board.findFirst({
			where: {
				id,
				userId
			},
			include: {
				columns: {
					include: {
						tasks: {
							where: { isArchived: false },
							orderBy: { order: 'asc' }
						}
					},
					orderBy: { order: 'asc' }
				}
			}
		})

		if (!board) {
			throw new NotFoundException(
				'Доска не найдена. Проверьте введенные данные.'
			)
		}

		return board
	}

	public async create(userId: string, dto: CreateBoardDto) {
		const orderCol1 = generateKeyBetween(null, null)
		const orderCol2 = generateKeyBetween(orderCol1, null)
		const orderCol3 = generateKeyBetween(orderCol2, null)

		const board = await prisma.board.create({
			data: {
				title: dto.title,
				userId,
				columns: {
					create: [
						{
							title: 'К исполнению',
							order: orderCol1,
							isDoneColumn: false
						},
						{
							title: 'В работе',
							order: orderCol2,
							isDoneColumn: false
						},
						{
							title: 'Готово',
							order: orderCol3,
							isDoneColumn: true
						}
					]
				}
			},
			include: {
				columns: {
					orderBy: { order: 'asc' }
				}
			}
		})

		return board
	}

	public async update(userId: string, id: string, dto: UpdateBoardDto) {
		const board = await prisma.board.findFirst({
			where: {
				id,
				userId
			}
		})

		if (!board) {
			throw new NotFoundException(
				'Доска не найдена. Проверьте введенные данные.'
			)
		}

		return prisma.board.update({
			where: {
				id
			},
			data: {
				title: dto.title
			}
		})
	}

	public async delete(userId: string, id: string) {
		const board = await prisma.board.findFirst({
			where: {
				id,
				userId
			}
		})

		if (!board) {
			throw new NotFoundException(
				'Доска не найдена. Проверьте введенные данные.'
			)
		}

		return prisma.board.delete({
			where: {
				id
			}
		})
	}

	public async getArchivedTasks(
		userId: string,
		boardId: string,
		page: number = 1,
		limit: number = 10
	) {
		const board = await prisma.board.findFirst({
			where: {
				id: boardId,
				userId
			}
		})

		if (!board) {
			throw new NotFoundException('Доска не найдена')
		}

		const skip = (page - 1) * limit

		const [tasks, total] = await prisma.$transaction([
			prisma.task.findMany({
				where: {
					column: { boardId },
					isArchived: true
				},
				skip,
				take: limit,
				orderBy: { archivedAt: 'desc' }
			}),
			prisma.task.count({
				where: {
					column: { boardId },
					isArchived: true
				}
			})
		])

		return {
			tasks,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit)
		}
	}
}
