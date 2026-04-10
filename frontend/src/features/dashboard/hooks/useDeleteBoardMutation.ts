import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { boardService } from '../services'

export function useDeleteBoardMutation() {
	const queryClient = useQueryClient()
	const { mutate: deleteBoard, isPending: isDeletingBoard } = useMutation({
		mutationKey: ['delete board'],
		mutationFn: async (id: string) => {
			await boardService.delete(id)
		},
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['boards'] })
			toast.success('Доска успешно удалена')
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return {
		deleteBoard,
		isDeletingBoard
	}
}
