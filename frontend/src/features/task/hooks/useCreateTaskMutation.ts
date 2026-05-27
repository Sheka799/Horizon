import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { taskService } from '../services'
import { CreateTaskData } from '../types'

export function useCreateTaskMutation() {
	const queryClient = useQueryClient()
	const { mutate: createTask, isPending: isCreatingTask } = useMutation({
		mutationKey: ['create task'],
		mutationFn: (taskData: CreateTaskData) =>
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
