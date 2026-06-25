import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { UserModule } from '@/user/user.module';
import { TaskAttachmentModule } from '@/task-attachment/task-attachment.module';

@Module({
  imports: [UserModule, TaskAttachmentModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
