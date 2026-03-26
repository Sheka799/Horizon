import { Metadata } from 'next'

import { ResetPasswordForm } from '@/features/auth/components'

export const metadata: Metadata = {
	title: 'Сброс пароля',
	description: 'Страница для сброса пароля пользователя'
}

export default function ResetPassword() {
	return <ResetPasswordForm />
}
