import { axiosClassic } from '@/shared/api'

import { TypeLoginSchema, TypeRegisterSchema } from '../schemes'
import { IUser } from '../types'
import { ROUTES } from '@/shared/config'

class AuthService {
	public async register(body: TypeRegisterSchema, recaptcha?: string) {
		const headers = recaptcha ? { recaptcha } : undefined
		const response = await axiosClassic.post<IUser>(
			ROUTES.AUTH.REGISTER,
			body,
			{ headers }
		)
		return response.data
	}

	public async login(body: TypeLoginSchema, recaptcha?: string) {
		const headers = recaptcha ? { recaptcha } : undefined
		const response = await axiosClassic.post<IUser>(ROUTES.AUTH.LOGIN, body, {
			headers
		})
		return response.data
	}

	public async oauthByProvider(provider: 'google' | 'yandex') {
		const response = await axiosClassic.get<{ url: string }>(
			`/auth/oauth/connect/${provider}`
		)
		return response.data
	}

	public async logout() {
		const response = await axiosClassic.post(ROUTES.AUTH.LOGOUT)
		return response
	}
}

export const authService = new AuthService()
