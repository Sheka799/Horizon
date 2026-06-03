import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { TypeUpdateTaskSchema } from '../schemes'
import { taskService } from '../services'

export function useUpdateTaskMutation() {
	const queryClient = useQueryClient()
	const { mutate: updateTask, isPending: isUpdatingTask } = useMutation({
		mutationKey: ['update task'],
		mutationFn: async (data: { id: string; dto: TypeUpdateTaskSchema }) => {
			const response = await taskService.update(data.id, data.dto)
			return response
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['board'] })
			queryClient.invalidateQueries({ queryKey: ['archived-tasks'] })
			toast.success('Задача успешно обновлена')
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { updateTask, isUpdatingTask }
}
