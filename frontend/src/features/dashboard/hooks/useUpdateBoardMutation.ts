import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { TypeBoardSchema } from '../schemes'
import { boardService } from '../services'

export function useUpdateBoardMutation() {
	const queryClient = useQueryClient()
	const { mutate: updateBoard, isPending: isUpdatingBoard } = useMutation({
		mutationKey: ['update board'],
		mutationFn: (data: { id: string; dto: TypeBoardSchema }) =>
			boardService.update(data.id, data.dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['boards'] })
			toast.success('Доска успешно обновлена')
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { updateBoard, isUpdatingBoard }
}
