import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { CsrfGuard } from './libs/common/guards/csrf.guard'
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
		ThrottlerModule.forRoot([
			{
				name: 'default',
				ttl: 60000,
				limit: 60
			}
		]),
		AuthModule,
		MailModule,
		StorageModule,
		BoardModule,
		ColumnModule,
		TaskModule,
		TaskAttachmentModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		},
		{
			provide: APP_GUARD,
			useClass: CsrfGuard
		}
	]
})
export class AppModule {}
