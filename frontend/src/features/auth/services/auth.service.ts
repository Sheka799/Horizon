import { axiosClassic } from '@/shared/api'

import { TypeLoginSchema, TypeRegisterSchema } from '../schemes'
import { IUser } from '../types'

class AuthService {
	public async register(body: TypeRegisterSchema, recaptcha?: string) {
		const headers = recaptcha ? { recaptcha } : undefined
		const response = await axiosClassic.post<IUser>(
			'/auth/register',
			body,
			{ headers }
		)
		return response.data
	}

	public async login(body: TypeLoginSchema, recaptcha?: string) {
		const headers = recaptcha ? { recaptcha } : undefined
		const response = await axiosClassic.post<IUser>('/auth/login', body, {
			headers
		})
		return response.data
	}

	public async logout() {
		const response = await axiosClassic.post('/auth/logout')
		return response
	}
}

export const authService = new AuthService()
