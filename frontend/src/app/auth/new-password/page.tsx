import { Metadata } from 'next'

import { NewPasswordForm } from '@/features/auth/components'
import { Suspense } from 'react'

export const metadata: Metadata = {
	title: 'Новый пароль'
}

export default function NewPasswordPage() {
	return (
		<Suspense fallback={null}>
			<NewPasswordForm />
		</Suspense>
	)
}
