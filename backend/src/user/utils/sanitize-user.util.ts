import { Account, User } from '@prisma/generated/prisma/client'

type UserWithAccounts = User & { accounts?: Account[] }

// убирает то, что никогда не должно улетать клиенту через HTTP-ответ
export function sanitizeUser<T extends UserWithAccounts>(user: T) {
	const { password, accounts, ...safeUser } = user

	return {
		...safeUser,
		accounts: accounts?.map(
			({ accessToken, refreshToken, ...safeAccount }) => safeAccount
		)
	}
}
