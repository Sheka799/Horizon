import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query
} from '@nestjs/common'
import { BoardService } from './board.service'
import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'
import { CreateBoardDto } from './dto/create-board.dto'
import { UpdateBoardDto } from './dto/update-board.dto'

@Controller('boards')
export class BoardController {
	constructor(private readonly boardService: BoardService) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get()
	async findAll(@Authorized('id') userId: string) {
		return this.boardService.findAll(userId)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get(':id')
	async findById(@Authorized('id') userId: string, @Param('id') id: string) {
		return this.boardService.findById(userId, id)
	}

	@Authorization()
	@HttpCode(HttpStatus.CREATED)
	@Post()
	async create(
		@Authorized('id') userId: string,
		@Body() dto: CreateBoardDto
	) {
		return this.boardService.create(userId, dto)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	async update(
		@Authorized('id') userId: string,
		@Param('id') id: string,
		@Body() dto: UpdateBoardDto
	) {
		return this.boardService.update(userId, id, dto)
	}

	@Authorization()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async delete(@Authorized('id') userId: string, @Param('id') id: string) {
		return this.boardService.delete(userId, id)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get(':boardId/tasks/archived')
	async getArchivedTasks(
		@Authorized('id') userId: string,
		@Param('boardId') boardId: string,
		@Query('page') page?: string,
		@Query('limit') limit?: string
	) {
		const pageNum = page ? parseInt(page) : 1
		const limitNum = limit ? parseInt(limit) : 10

		return this.boardService.getArchivedTasks(
			userId,
			boardId,
			pageNum,
			limitNum
		)
	}
}
