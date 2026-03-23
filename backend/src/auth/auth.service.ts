import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import { UserService } from '../user/user.service'
import { AuthMethod } from '@prisma/generated/prisma/enums'
import { User } from '@prisma/generated/prisma/client'
import { Request, Response } from 'express'
import { LoginDto } from './dto/login.dto'
import { verify } from 'argon2'
import { ConfigService } from '@nestjs/config'
import { prisma } from '@/libs/prisma'
import { ProviderService } from './provider/provider.service'

@Injectable()
export class AuthService {
	public constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly providerService: ProviderService
	) {}

	public async register(req: Request, dto: RegisterDto) {
		const isExists = await this.userService.findByEmail(dto.email)

		if (isExists) {
			throw new ConflictException(
				'Регистрация не удалась. Пользователь с таким email уже существует. Пожалуйста, используйте другой email или войдите в систему.'
			)
		}

		const newUser = await this.userService.create(
			dto.email,
			dto.password,
			dto.email,
			'',
			AuthMethod.CREDENTIALS,
			false
		)

		return this.saveSession(req, newUser)
	}

	public async login(req: Request, dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email)

		if (!user || !user.password) {
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста проверьте введенные данные.'
			)
		}

		const isValidPassword = await verify(user.password, dto.password)

		if (!isValidPassword) {
			throw new UnauthorizedException(
				'Пользователь не найден. Пожалуйста проверьте введенные данные.'
			)
		}

		return this.saveSession(req, user)
	}

	public async extractProfileFromCode(
		req: Request,
		provider: string,
		code: string
	) {
		const providerInstance = this.providerService.findByService(provider)

		if (!providerInstance) {
			throw new NotFoundException(`Провайдер '${provider}' не найден.`)
		}

		const profile = await providerInstance.findUserByCode(code)

		const account = await prisma.account.findFirst({
			where: {
				id: profile.id,
				provider: profile.provider
			}
		})

		let user = account?.userId
			? await this.userService.findById(account.userId)
			: null

		if (user) {
			return this.saveSession(req, user)
		}

		user = await this.userService.create(
			profile.email,
			'',
			profile.name,
			profile.picture,
			AuthMethod[
				profile.provider.toUpperCase() as keyof typeof AuthMethod
			],
			true
		)

		if (!account) {
			await prisma.account.create({
				data: {
					userId: user.id,
					type: 'oauth',
					provider: profile.provider,
					accessToken: profile.access_token,
					refreshToken: profile.refresh_token,
					expiresAt: this.calculateExpiresAt(profile.expires_at)
				}
			})
		}

		return this.saveSession(req, user)
	}

	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже была завершена.'
						)
					)
				}

				res.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME')
				)
				resolve()
			})
		})
	}

	public async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id

			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось сохранить сессию. Проверьте, правильно ли настроены параметры сессии.'
						)
					)
				}

				resolve({ user })
			})
		})
	}

	private calculateExpiresAt(expiresAt?: number): number {
		if (expiresAt) {
			return expiresAt
		}

		if (typeof expiresAt === 'number' && expiresAt < 1000000000000) {
			return Date.now() + expiresAt * 1000
		}

		// Значение по умолчанию: 1 час с текущего момента
		return Date.now() + 60 * 60 * 1000
	}
}
