import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { TypeLoginSchema } from '../schemes'
import { authService } from '../services'

export function useLoginMutation() {
	const router = useRouter()

	const { mutate: login, isPending: IsLoadingLogin } = useMutation({
		mutationKey: ['login user'],
		mutationFn: ({
			values,
			recaptcha
		}: {
			values: TypeLoginSchema
			recaptcha: string
		}) => authService.login(values, recaptcha),
		onSuccess: (data: any) => {
			if (data.message) {
				toastMessageHandler(data)
				console.log('1')
			} else {
				toast.success('Успешный вход!', {
					description: 'Вы успешно вошли в систему'
				})
				router.refresh()
				router.push('/dashboard/settings')
				console.log('2')
			}
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { login, IsLoadingLogin }
}
