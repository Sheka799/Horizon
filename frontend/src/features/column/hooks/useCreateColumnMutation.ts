import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { columnService } from '../services'

export function useCreateColumnMutation() {
	const queryClient = useQueryClient()
	const { mutate: createColumn, isPending: isCreatingColumn } = useMutation({
		mutationKey: ['create column'],
		mutationFn: ({ boardId, title }: { boardId: string; title: string }) =>
			columnService.create(boardId, title),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['board'] })
			toast.success('Колонка успешно создана')
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { createColumn, isCreatingColumn }
}
