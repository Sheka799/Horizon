import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { columnService } from '../services'

export function useDeleteColumnMutation() {
	const queryClient = useQueryClient()
	const { mutate: deleteColumn, isPending: isDeletingColumn } = useMutation({
		mutationKey: ['delete column'],
		mutationFn: async (id: string) => {
			await columnService.delete(id)
		},
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['board'] })
			toast.success('Колонка успешно удалена')
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return {
		deleteColumn,
		isDeletingColumn
	}
}
