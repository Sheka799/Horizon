export enum EUserRole {
	Regular = 'REGULAR',
	Admin = 'ADMIN'
}

export enum EAuthMethod {
	Credentials = 'CREDENTIALS',
	Google = 'GOOGLE',
	Yandex = 'YANDEX'
}

export interface IAccount {
	id: string
	type: string
	provider: string
	refreshToken: string
	accessToken: string
	expiresAt: number
	createdAt: string
	updatedAt: string
	userId: string
}

export interface IUser {
	id: string
	email: string
	password: string
	displayName: string
	picture: string
	role: EUserRole
	isVerified: boolean
	isTwoFactorEnabled: boolean
	method: EAuthMethod
	accounts: IAccount[]
	createdAt: string
	updatedAt: string
}
