import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post
} from '@nestjs/common'
import { ColumnService } from './column.service'
import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'
import { CreateColumnDto } from './dto/create-column.dto'
import { UpdateColumnDto } from './dto/update-column.dto'

@Controller('columns')
export class ColumnController {
	constructor(private readonly columnService: ColumnService) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get(':id')
	async findById(@Authorized('id') userId: string, @Param('id') id: string) {
		return this.columnService.findById(userId, id)
	}

	@Authorization()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async delete(@Authorized('id') userId: string, @Param('id') id: string) {
		return this.columnService.delete(userId, id)
	}

	@Authorization()
	@HttpCode(HttpStatus.CREATED)
	@Post()
	async create(
		@Authorized('id') userId: string,
		@Body() dto: CreateColumnDto
	) {
		return this.columnService.create(userId, dto)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	async update(
		@Authorized('id') userId: string,
		@Param('id') id: string,
		@Body() dto: UpdateColumnDto
	) {
		return this.columnService.update(userId, id, dto)
	}
}
