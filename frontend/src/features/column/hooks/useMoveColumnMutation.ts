import { useMutation, useQueryClient } from '@tanstack/react-query'
import { generateKeyBetween } from 'fractional-indexing'

import { Board } from '@/features/dashboard/types'

import { columnService } from '../services'

export function useMoveColumnMutation(boardId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			prevOrder,
			nextOrder
		}: {
			id: string
			prevOrder: string | null
			nextOrder: string | null
		}) => columnService.moveColumn(id, { prevOrder, nextOrder }),

		onMutate: async ({ id, prevOrder, nextOrder }) => {
			await queryClient.cancelQueries({ queryKey: ['board', boardId] })
			const previous = queryClient.getQueryData<Board>(['board', boardId])

			queryClient.setQueryData<Board>(['board', boardId], old => {
				if (!old) return old

				return {
					...old,
					columns: old.columns
						.map(col =>
							col.id === id
								? {
										...col,
										order: generateKeyBetween(
											prevOrder,
											nextOrder
										)
									}
								: col
						)
						.sort((a, b) =>
							a.order < b.order ? -1 : a.order > b.order ? 1 : 0
						)
				}
			})

			return { previous }
		},

		onError: (_, __, ctx) => {
			queryClient.setQueryData(['board', boardId], ctx?.previous)
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['board', boardId] })
		}
	})
}
