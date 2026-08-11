import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

import { isDev } from '@/libs/common/utils/is-dev.util'

interface SmartCaptchaResponse {
	status: 'ok' | 'failed'
	message?: string
	host?: string
}

@Injectable()
export class SmartCaptchaGuard implements CanActivate {
	public constructor(private readonly configService: ConfigService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		// if (isDev(this.configService)) {
		// 	return true
		// }

		const request = context.switchToHttp().getRequest<Request>()
		const token = request.headers['smart-token'] as string | undefined

		if (!token) {
			throw new BadRequestException('Токен капчи не передан')
		}

		const secretKey = this.configService.getOrThrow<string>(
			'YANDEX_SMART_CAPTCHA_SERVER_KEY'
		)

		const params = new URLSearchParams()
		params.append('secret', secretKey)
		params.append('token', token)
		params.append('ip', request.ip ?? '')

		const response = await fetch(
			'https://smartcaptcha.yandexcloud.net/validate',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: params.toString()
			}
		)

		const data = (await response.json()) as SmartCaptchaResponse

		if (data.status !== 'ok') {
			throw new BadRequestException('Капча не пройдена, попробуйте снова')
		}

		return true
	}
}
