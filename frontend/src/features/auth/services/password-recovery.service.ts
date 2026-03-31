import { axiosClassic } from '@/shared/api'

import { TypeNewPasswordSchema, TypeResetPasswordSchema } from '../schemes'
import { IUser } from '../types'
import { ROUTES } from '@/shared/config'

class PasswordRecoveryService {
	public async reset(body: TypeResetPasswordSchema, recaptcha?: string) {
		const headers = recaptcha ? { recaptcha } : undefined
		const response = await axiosClassic.post<IUser>(
			`${ROUTES.AUTH.PASSWORD_RECOVERY}/reset`,
			body,
			{
				headers
			}
		)
		return response
	}

	public async new(
		body: TypeNewPasswordSchema,
		token: string | null,
		recaptcha?: string
	) {
		const headers = recaptcha ? { recaptcha } : undefined
		const response = await axiosClassic.post<IUser>(
			`${ROUTES.AUTH.PASSWORD_RECOVERY}/new/${token}`,
			body,
			{
				headers
			}
		)
		return response
	}
}

export const passwordRecoveryService = new PasswordRecoveryService()
