import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { TypeColumnSchema } from '../schemes'
import { columnService } from '../services'

export function useUpdateColumnMutation() {
	const queryClient = useQueryClient()
	const { mutate: updateColumn, isPending: isUpdatingColumn } = useMutation({
		mutationKey: ['update column'],
		mutationFn: (data: { id: string; dto: TypeColumnSchema }) =>
			columnService.update(data.id, data.dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['board'] })
			toast.success('Колонка успешно обновлена')
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { updateColumn, isUpdatingColumn }
}
