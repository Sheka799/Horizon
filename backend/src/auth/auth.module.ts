import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { ProviderModule } from './provider/provider.module'
import { getProvidersConfig } from '@/config/providers.config'
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module'
import { UserModule } from '@/user/user.module'
import { PasswordRecoveryModule } from './password-recovery/password-recovery.module'
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module'
import { SmartCaptchaGuard } from '@/libs/common/guards/smart-captcha.guard'

@Module({
	imports: [
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getProvidersConfig,
			inject: [ConfigService]
		}),
		UserModule,
		PasswordRecoveryModule,
		TwoFactorAuthModule,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		forwardRef(() => EmailConfirmationModule)
	],
	controllers: [AuthController],
	providers: [AuthService, SmartCaptchaGuard],
	exports: [AuthService]
})
export class AuthModule {}