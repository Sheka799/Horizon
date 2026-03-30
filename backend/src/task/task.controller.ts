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
import { TaskService } from './task.service'
import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update.task.dto'

@Controller('tasks')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get(':id')
	async getById(@Authorized('id') userId: string, @Param('id') id: string) {
		return this.taskService.getById(userId, id)
	}

	@Authorization()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async delete(@Authorized('id') userId: string, @Param('id') id: string) {
		return this.taskService.delete(userId, id)
	}

	@Authorization()
	@HttpCode(HttpStatus.CREATED)
	@Post()
	async create(@Authorized('id') userId: string, @Body() dto: CreateTaskDto) {
		return this.taskService.create(userId, dto)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	async update(
		@Authorized('id') userId: string,
		@Param('id') id: string,
		@Body() dto: UpdateTaskDto
	) {
		return this.taskService.update(userId, id, dto)
	}
}
