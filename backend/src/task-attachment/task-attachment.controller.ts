import {
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { MAX_FILE_SIZE_BYTES } from './attachment.constants'
import { TaskAttachmentService } from './task-attachment.service'

@Controller('tasks/:taskId/attachments')
export class TaskAttachmentController {
	public constructor(
		private readonly taskAttachmentService: TaskAttachmentService
	) {}

	@Authorization()
	@HttpCode(HttpStatus.CREATED)
	@Post()
	@UseInterceptors(
		FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE_BYTES } })
	)
	public async upload(
		@Authorized('id') userId: string,
		@Param('taskId') taskId: string,
		@UploadedFile() file: any
	) {
		return this.taskAttachmentService.upload(userId, taskId, file)
	}

	@Authorization()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':attachmentId')
	public async remove(
		@Authorized('id') userId: string,
		@Param('attachmentId') attachmentId: string
	) {
		return this.taskAttachmentService.remove(userId, attachmentId)
	}
}
