import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { TypeSettingSchema } from '../schemes'
import { userServive } from '../services'

export function useUpdateProfileMutation() {
	const queryClient = useQueryClient()
	const { mutate: update, isPending: isLoadingUpdate } = useMutation({
		mutationKey: ['update profile'],
		mutationFn: (data: TypeSettingSchema) =>
			userServive.updateProfile(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['profile'] })
			toast.success('Данные успешно обновлены')
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { update, isLoadingUpdate }
}
