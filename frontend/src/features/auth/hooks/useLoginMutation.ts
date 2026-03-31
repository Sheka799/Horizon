import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { TypeLoginSchema } from '../schemes'
import { authService } from '../services'
import { ROUTES } from '@/shared/config'

export function useLoginMutation(setIsShowTwoFactor: React.Dispatch<React.SetStateAction<boolean>>) {
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
				setIsShowTwoFactor(true)
			} else {
				toast.success('Успешный вход!', {
					description: 'Вы успешно вошли в систему'
				})
				router.push(ROUTES.DASHBOARD.ROOT)
			}
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { login, IsLoadingLogin }
}
