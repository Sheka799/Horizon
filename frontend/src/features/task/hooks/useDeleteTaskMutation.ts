import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { taskService } from '../services'

export function useDeleteTaskMutation() {
	const queryClient = useQueryClient()
	const { mutate: deleteTask, isPending: isDeletingTask } = useMutation({
		mutationKey: ['delete column'],
		mutationFn: async (id: string) => {
			await taskService.delete(id)
		},
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['board'] })
			queryClient.invalidateQueries({ queryKey: ['archived-tasks'] })
			toast.success('Задача успешно удалена')
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return {
		deleteTask,
		isDeletingTask
	}
}
