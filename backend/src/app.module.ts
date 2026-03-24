import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util'
import { MailModule } from './libs/mail/mail.module';
import { AuthModule } from './auth/auth.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		AuthModule,
		MailModule
	]
})
export class AppModule {}
