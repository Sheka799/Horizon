import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { attachmentService } from '../services'

export function useUploadAttachmentMutation(taskId: string) {
	const queryClient = useQueryClient()

	const { mutateAsync: uploadAttachment, isPending: isUploadingAttachment } =
		useMutation({
			mutationKey: ['upload attachment', taskId],
			mutationFn: (file: File) => attachmentService.upload(taskId, file),
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: ['task', taskId] })
			},
			onError(error) {
				toastMessageHandler(error)
			}
		})

	return { uploadAttachment, isUploadingAttachment }
}

export function useDeleteAttachmentMutation(taskId: string) {
	const queryClient = useQueryClient()

	const { mutate: deleteAttachment, isPending: isDeletingAttachment } =
		useMutation({
			mutationKey: ['delete attachment', taskId],
			mutationFn: (attachmentId: string) =>
				attachmentService.delete(taskId, attachmentId),
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: ['task', taskId] })
				toast.success('Вложение удалено')
			},
			onError(error) {
				toastMessageHandler(error)
			}
		})

	return { deleteAttachment, isDeletingAttachment }
}
