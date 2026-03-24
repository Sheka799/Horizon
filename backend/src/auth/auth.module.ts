import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getRecaptchaConfig } from '@/config/recaptcha.config'
import { ProviderModule } from './provider/provider.module'
import { getProvidersConfig } from '@/config/providers.config'
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module'
import { UserModule } from '@/user/user.module'
import { PasswordRecoveryModule } from './password-recovery/password-recovery.module'
@Module({
	imports: [
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getProvidersConfig,
			inject: [ConfigService]
		}),
		UserModule,
		PasswordRecoveryModule,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		forwardRef(() => EmailConfirmationModule),
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getRecaptchaConfig,
			inject: [ConfigService]
		})
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService]
})
export class AuthModule {}
