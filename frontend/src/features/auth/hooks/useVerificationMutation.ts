import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { verificationService } from '../services'
import { ROUTES } from '@/shared/config'

export function useVerificationMutation() {
	const router = useRouter()

	const { mutate: verification } = useMutation({
		mutationKey: ['verification email'],
		mutationFn: (token: string | null) =>
			verificationService.newVerification(token),
		onSuccess() {
			toast.success('Почта успешно подтверждена')
			router.push(ROUTES.DASHBOARD.ROOT)
		},
		onError() {
			router.push(ROUTES.AUTH.LOGIN)
		}
	})

	return { verification }
}
