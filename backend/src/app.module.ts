import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util'
import { MailModule } from './libs/mail/mail.module';
import { AuthModule } from './auth/auth.module'
import { BoardModule } from './board/board.module';
import { ColumnModule } from './column/column.module';
import { TaskModule } from './task/task.module';
import { StorageModule } from './libs/storage/storage.module';
import { TaskAttachmentModule } from './task-attachment/task-attachment.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		AuthModule,
		MailModule,
		StorageModule,
		BoardModule,
		ColumnModule,
		TaskModule,
		TaskAttachmentModule
	]
})
export class AppModule {}
