import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	UseGuards
} from '@nestjs/common'
import { PasswordRecoveryService } from './password-recovery.service'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { NewPasswordDto } from './dto/new-password.dto'
import { SmartCaptchaGuard } from '@/libs/common/guards/smart-captcha.guard'
import { Throttle } from '@nestjs/throttler'

@Controller('auth/password-recovery')
export class PasswordRecoveryController {
	constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService
	) {}

	@Throttle({ default: { limit: 5, ttl: 60000 } })
	@UseGuards(SmartCaptchaGuard)
	@Post('reset')
	@HttpCode(HttpStatus.OK)
	public async resetPassword(@Body() dto: ResetPasswordDto) {
		return this.passwordRecoveryService.resetPassword(dto)
	}

	@Throttle({ default: { limit: 5, ttl: 60000 } })
	@UseGuards(SmartCaptchaGuard)
	@Post('new/:token')
	@HttpCode(HttpStatus.OK)
	public async newPassword(
		@Body() dto: NewPasswordDto,
		@Param('token') token: string
	) {
		return this.passwordRecoveryService.newPassword(dto, token)
	}
}
