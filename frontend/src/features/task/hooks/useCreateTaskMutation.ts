import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { TypeCreateTaskSchema } from '../schemes'
import { taskService } from '../services'

export function useCreateTaskMutation() {
	const queryClient = useQueryClient()
	const { mutate: createTask, isPending: isCreatingTask } = useMutation({
		mutationKey: ['create task'],
		mutationFn: (taskData: TypeCreateTaskSchema) =>
			taskService.create(taskData),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['board'] })
			toast.success('Задача успешно создана')
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { createTask, isCreatingTask }
}
