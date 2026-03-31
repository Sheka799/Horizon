import { Metadata } from 'next'

import { NewVerificationForm } from '@/features/auth/components'
import { Suspense } from 'react'

export const metadata: Metadata = {
	title: 'Подтверждение почты'
}

export default function NewVerificationPage() {
	return (
		<Suspense fallback={null}>
			<NewVerificationForm />
		</Suspense>
	)
}
