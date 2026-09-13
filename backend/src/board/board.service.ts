import { prisma } from '@/libs/prisma'
import { Injectable, NotFoundException } from '@nestjs/common'
import { generateKeyBetween } from 'fractional-indexing'
import { TaskStatus } from '@prisma/generated/prisma/enums'
import { UpdateBoardDto } from './dto/update-board.dto'
import { CreateBoardDto } from './dto/create-board.dto'

function startOfUtcDay(date: Date) {
	const result = new Date(date)
	result.setUTCHours(0, 0, 0, 0)
	return result
}

function dateKey(date: Date) {
	return date.toISOString().slice(0, 10)
}

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

	public async stats(userId: string) {
		const [
			boardsCount,
			activeTasksCount,
			overdueTasksCount,
			doneLastWeekCount,
			activity,
			upcomingDeadlines
		] = await Promise.all([
			prisma.board.count({
				where: {
					userId
				}
			}),
			prisma.task.count({
				where: {
					column: {
						board: {
							userId
						}
					},
					isArchived: false,
					status: TaskStatus.ACTIVE
				}
			}),
			prisma.task.count({
				where: {
					column: {
						board: {
							userId
						}
					},
					isArchived: false,
					status: TaskStatus.ACTIVE,
					dueDate: {
						lte: new Date()
					}
				}
			}),
			prisma.task.count({
				where: {
					column: {
						board: {
							userId
						}
					},
					isArchived: false,
					completedAt: {
						gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
					}
				}
			}),
			this.getActivity(userId),
			this.getUpcomingDeadlines(userId)
		])

		return {
			boardsCount,
			activeTasksCount,
			overdueTasksCount,
			doneLastWeekCount,
			activity,
			upcomingDeadlines
		}
	}

	// Кол-во выполненных задач по дням за последние 14 дней
	private async getActivity(userId: string) {
		const days = 14
		const from = startOfUtcDay(
			new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000)
		)

		const completedTasks = await prisma.task.findMany({
			where: {
				column: {
					board: {
						userId
					}
				},
				completedAt: {
					gte: from
				}
			},
			select: {
				completedAt: true
			}
		})

		const buckets = new Map<string, number>()
		for (let i = 0; i < days; i++) {
			const date = new Date(from)
			date.setUTCDate(date.getUTCDate() + i)
			buckets.set(dateKey(date), 0)
		}

		for (const task of completedTasks) {
			if (!task.completedAt) continue

			const key = dateKey(task.completedAt)
			if (buckets.has(key)) {
				buckets.set(key, (buckets.get(key) ?? 0) + 1)
			}
		}

		return Array.from(buckets.entries()).map(([date, count]) => ({
			date,
			count
		}))
	}

	// Ближайшие 5 задач с дедлайном
	private async getUpcomingDeadlines(userId: string) {
		const tasks = await prisma.task.findMany({
			where: {
				column: {
					board: {
						userId
					}
				},
				isArchived: false,
				status: TaskStatus.ACTIVE,
				dueDate: {
					not: null
				}
			},
			orderBy: { dueDate: 'asc' },
			take: 5,
			include: {
				column: {
					include: {
						board: {
							select: { id: true, title: true }
						}
					}
				}
			}
		})

		return tasks.map(task => ({
			id: task.id,
			name: task.name,
			priority: task.priority,
			dueDate: task.dueDate,
			status: task.status,
			boardId: task.column.board.id,
			boardTitle: task.column.board.title
		}))
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
