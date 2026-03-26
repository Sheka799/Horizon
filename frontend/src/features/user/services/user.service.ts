import { IUser } from '@/features/auth/types'

import { axiosWithAuth } from '@/shared/api'

import { TypeSettingSchema } from '../schemes'

class UserService {
	public async findProfile(): Promise<IUser> {
		const response = (await axiosWithAuth.get<IUser>(
			'users/profile'
		)) as unknown as IUser

		return response
	}

	public async updateProfile(body: TypeSettingSchema): Promise<IUser> {
		const response = (await axiosWithAuth.patch<IUser>(
			'users/profile',
			body
		)) as unknown as IUser

		return response
	}
}

export const userServive = new UserService()
