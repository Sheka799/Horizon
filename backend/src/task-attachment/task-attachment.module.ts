import { Module } from '@nestjs/common'

import { TaskAttachmentController } from './task-attachment.controller'
import { TaskAttachmentService } from './task-attachment.service'
import { UserModule } from '@/user/user.module'

@Module({
	imports: [UserModule],
	controllers: [TaskAttachmentController],
	providers: [TaskAttachmentService],
	exports: [TaskAttachmentService]
})
export class TaskAttachmentModule {}
