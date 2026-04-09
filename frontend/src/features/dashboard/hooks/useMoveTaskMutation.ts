import { useMutation, useQueryClient } from '@tanstack/react-query'
import { generateKeyBetween } from 'fractional-indexing'

import { boardService } from '../services'
import { Board } from '../types'

export function useMoveTaskMutation(boardId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			columnId,
			prevOrder,
			nextOrder
		}: {
			id: string
			columnId: string
			prevOrder: string | null
			nextOrder: string | null
		}) => boardService.moveTask(id, { columnId, prevOrder, nextOrder }),

		onMutate: async ({ id, columnId, prevOrder, nextOrder }) => {
			await queryClient.cancelQueries({ queryKey: ['board', boardId] })
			const previous = queryClient.getQueryData<Board>(['board', boardId])

			queryClient.setQueryData<Board>(['board', boardId], old => {
				if (!old) return old

				let task = old.columns
					.flatMap(c => c.tasks)
					.find(t => t.id === id)
				if (!task) return old

				task = {
					...task,
					columnId,
					order: generateKeyBetween(prevOrder, nextOrder)
				}

				return {
					...old,
					columns: old.columns.map(col => ({
						...col,
						tasks:
							col.id === columnId
								? [
										...col.tasks.filter(t => t.id !== id),
										task!
									].sort((a, b) =>
										a.order < b.order
											? -1
											: a.order > b.order
												? 1
												: 0
									)
								: col.tasks.filter(t => t.id !== id)
					}))
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
