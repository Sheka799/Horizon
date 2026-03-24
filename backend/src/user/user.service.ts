import { Injectable, NotFoundException } from '@nestjs/common'
import { hash } from 'argon2'
import { AuthMethod } from '@prisma/generated/prisma/enums'
import { prisma } from '@/libs/prisma'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
	public async findById(id: string) {
		const user = await prisma.user.findUnique({
			where: {
				id
			},
			include: {
				accounts: true
			}
		})

		if (!user) {
			throw new NotFoundException(
				'Пользователь не найден. Проверьте введенные данные.'
			)
		}

		return user
	}

	public async findByEmail(email: string) {
		const user = await prisma.user.findUnique({
			where: {
				email
			},
			include: {
				accounts: true
			}
		})

		return user
	}

	public async create(
		email: string,
		password: string,
		displayName: string,
		picture: string,
		method: AuthMethod,
		isVerified: boolean
	) {
		const user = await prisma.user.create({
			data: {
				email,
				password: password ? await hash(password) : '',
				displayName,
				picture,
				method,
				isVerified
			},
			include: {
				accounts: true
			}
		})

		return user
	}

	public async update(usetId: string, dto: UpdateUserDto) {
		const user = await this.findById(usetId)

		const updateUser = await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				email: dto.email,
				displayName: dto.name,
				isTwoFactorEnabled: dto.isTwoFactorEnabled
			}
		})

		return updateUser
	}
}
