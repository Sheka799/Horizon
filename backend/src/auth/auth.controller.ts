import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	Post,
	Query,
	Req,
	Res,
	UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { Request, Response } from 'express'
import { LoginDto } from './dto/login.dto'
import { AuthProviderGuard } from './guards/provider.guard'
import { ConfigService } from '@nestjs/config'
import { ProviderService } from './provider/provider.service'
import { SmartCaptchaGuard } from '@/libs/common/guards/smart-captcha.guard'
import { Throttle } from '@nestjs/throttler'

@Controller('auth')
export class AuthController {
	public constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
		private readonly providerService: ProviderService
	) {}

	@Throttle({ default: { limit: 5, ttl: 60000 } })
	@UseGuards(SmartCaptchaGuard)
	@Post('register')
	@HttpCode(HttpStatus.OK)
	public async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto)
	}

	@Throttle({ default: { limit: 5, ttl: 60000 } })
	@UseGuards(SmartCaptchaGuard)
	@Post('login')
	@HttpCode(HttpStatus.OK)
	public async login(@Req() req: Request, @Body() dto: LoginDto) {
		return this.authService.login(req, dto)
	}

	@Get('/oauth/callback/:provider')
	@UseGuards(AuthProviderGuard)
	public async callback(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Query('code') code: string,
		@Query('state') state: string,
		@Param('provider') provider: string
	) {
		if (!code) {
			throw new BadRequestException('Не был предоставлен код авторизации')
		}

		await this.authService.extractProfileFromCode(req, provider, code, state)

		return res.redirect(
			`${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`
		)
	}

	@UseGuards(AuthProviderGuard)
	@Get('/oauth/connect/:provider')
	public async connect(@Req() req: Request, @Param('provider') provider: string) {
		const providerInstance = this.providerService.findByService(provider)

		if (!providerInstance) {
			throw new NotFoundException(`Провайдер '${provider}' не найден.`)
		}

		const state = await this.authService.createOAuthState(req)

		return {
			url: providerInstance.getAuthUrl(state)
		}
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	public async logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		return this.authService.logout(req, res)
	}
}
