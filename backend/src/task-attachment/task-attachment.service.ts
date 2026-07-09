import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'

import { prisma } from '@/libs/prisma'
import { StorageService } from '@/libs/storage/storage.service'

import {
	ALLOWED_MIME_TYPES,
	MAX_FILE_SIZE_BYTES,
	isImageMimeType
} from './attachment.constants'

interface UploadedFileLike {
	buffer: Buffer
	mimetype: string
	originalname: string
	size: number
}

@Injectable()
export class TaskAttachmentService {
	public constructor(private readonly storageService: StorageService) {}

	public async upload(userId: string, taskId: string, rawFile: any) {
		if (!rawFile) {
			throw new BadRequestException('Файл не передан')
		}

		const file = rawFile as UploadedFileLike

		if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
			throw new BadRequestException(
				`Недопустимый тип файла: ${file.mimetype}`
			)
		}

		if (file.size > MAX_FILE_SIZE_BYTES) {
			throw new BadRequestException(
				`Файл слишком большой. Максимум ${MAX_FILE_SIZE_BYTES / 1024 / 1024} МБ`
			)
		}

		const task = await prisma.task.findFirst({
			where: {
				id: taskId,
				column: { board: { userId } }
			},
			select: { id: true }
		})

		if (!task) {
			throw new NotFoundException('Задача не найдена')
		}

		const key = `tasks/${taskId}/${randomUUID()}${extname(file.originalname)}`

		const url = await this.storageService.upload(
			file.buffer,
			key,
			file.mimetype
		)

		const attachment = await prisma.taskAttachment.create({
			data: {
				taskId,
				key,
				url,
				name: Buffer.from(file.originalname, 'latin1').toString('utf8'),
				mimetype: file.mimetype,
				size: file.size
			}
		})

		return {
			id: attachment.id,
			url: attachment.url,
			name: attachment.name,
			mimetype: attachment.mimetype,
			size: attachment.size,
			isImage: isImageMimeType(attachment.mimetype)
		}
	}

	public async remove(userId: string, attachmentId: string) {
		const attachment = await prisma.taskAttachment.findFirst({
			where: {
				id: attachmentId,
				task: { column: { board: { userId } } }
			}
		})

		if (!attachment) {
			throw new NotFoundException('Вложение не найдено')
		}

		await prisma.taskAttachment.delete({ where: { id: attachmentId } })
		await this.storageService.remove(attachment.key)

		return { success: true }
	}

	public async removeAllForTask(taskId: string) {
		const attachments = await prisma.taskAttachment.findMany({
			where: { taskId },
			select: { key: true }
		})

		await Promise.all(
			attachments.map(attachment =>
				this.storageService.remove(attachment.key)
			)
		)
	}
}
