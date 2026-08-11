import { axiosClassic } from '@/shared/api'
import { ROUTES } from '@/shared/config'

import { TypeNewPasswordSchema, TypeResetPasswordSchema } from '../schemes'
import { IUser } from '../types'

class PasswordRecoveryService {
	public async reset(body: TypeResetPasswordSchema, recaptcha?: string) {
		const headers = recaptcha ? { 'smart-token': recaptcha } : undefined
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
		const headers = recaptcha ? { 'smart-token': recaptcha } : undefined
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
