export const ROUTES = {
	HOME: '/',

	AUTH: {
		LOGIN: '/auth/login',
		REGISTER: '/auth/register',
		NEW_PASSWORD: '/auth/new-password',
		RESET_PASSWORD: '/auth/reset-password',
		NEW_VERIFICATION: '/auth/new-verification',
		LOGOUT: '/auth/logout',
		PASSWORD_RECOVERY: '/auth/password-recovery',
	},

	DASHBOARD: {
		ROOT: '/dashboard',
		BOARDS: '/dashboard/boards',
		BOARD: '/dashboard/board',
		SETTINGS: '/dashboard/settings',
		PROFILE: '/dashboard/profile'
	}
} as const
