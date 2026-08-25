import { MailService } from '@/libs/mail/mail.service'
import { prisma } from '@/libs/prisma'
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { TokenType } from '@prisma/generated/prisma/enums'
import { randomInt } from 'node:crypto'

// после этого числа неверных попыток токен инвалидируется —
// дальше подбор кода бессмысленен, нужно запросить новый
const MAX_TWO_FACTOR_ATTEMPTS = 5

@Injectable()
export class TwoFactorAuthService {
	public constructor(private readonly mailService: MailService) {}

	public async validateTwoFactorToken(email: string, code: string) {
		const existingToken = await prisma.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})

		if (!existingToken) {
			throw new NotFoundException(
				`Токен двухфакторной аутентификации не найден. Пожалуйста, убедитесь, что вы запрашивали токен для данного адреса электронной почты.`
			)
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException(
				'Срок действия токена двухфакторной аутентификации истек. Пожалуйста, запросите новый токен.'
			)
		}

		if (existingToken.attempts >= MAX_TWO_FACTOR_ATTEMPTS) {
			await prisma.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.TWO_FACTOR
				}
			})

			throw new BadRequestException(
				'Превышено количество попыток ввода кода. Пожалуйста, запросите новый код.'
			)
		}

		if (existingToken.token !== code) {
			await prisma.token.update({
				where: { id: existingToken.id },
				data: { attempts: existingToken.attempts + 1 }
			})

			throw new BadRequestException(
				'Неверный код двухфакторной аутентификации. Пожалуйста, проверьте введенный код и попробуйте снова.'
			)
		}

		await prisma.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.TWO_FACTOR
			}
		})

		return true
	}

	public async sendTwoFactorToken(email: string) {
		const twoFactorToken = await this.generateTwoFactorToken(
			email
		)

		await this.mailService.sendTwoFactorTokenEmail(
			twoFactorToken.email,
			twoFactorToken.token
		)

		return true
	}

	private async generateTwoFactorToken(email: string) {
		const token = randomInt(100000, 1000000).toString()
		const expiresIn = new Date(new Date().getTime() + 300000) // 5 минут

		const existingToken = await prisma.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})

		if (existingToken) {
			await prisma.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.TWO_FACTOR
				}
			})
		}

		const twoFactorToken = await prisma.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.TWO_FACTOR
			}
		})

		return twoFactorToken
	}
}
