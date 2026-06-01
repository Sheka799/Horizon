import { useMutation } from '@tanstack/react-query'

import { TypeBoardSchema } from '../schemes'
import { boardService } from '../services'
import { toastMessageHandler } from '@/shared/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/shared/config'

export function useCreateBoardMutation() {
	const router = useRouter()

	const { mutate: createBoard, isPending: isCreatingBoard } = useMutation({
		mutationKey: ['create board'],
		mutationFn: ({ values }: { values: TypeBoardSchema }) =>
			boardService.create(values),
		onSuccess(data) {
            toast.success('Доска успешно создана')
			router.push(`${ROUTES.DASHBOARD.BOARD}/${data.id}`)
        },
		onError(error) {
            toastMessageHandler(error)
        }
	})

	return { createBoard, isCreatingBoard }
}
