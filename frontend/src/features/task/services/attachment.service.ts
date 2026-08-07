import { IAttachment } from '@/features/board/types'

import { axiosWithAuth } from '@/shared/api'

class AttachmentService {
	public async upload(
		taskId: string,
		file: File,
		onProgress?: (percent: number) => void
	) {
		const formData = new FormData()
		formData.append('file', file)

		const response = (await axiosWithAuth.post(
			`tasks/${taskId}/attachments`,
			formData,
			{
				headers: { 'Content-Type': 'multipart/form-data' },
				onUploadProgress: event => {
					if (!onProgress || !event.total) return
					const percent = Math.round(
						(event.loaded * 100) / event.total
					)
					onProgress(percent)
				}
			}
		)) as unknown as IAttachment

		return response
	}

	public async delete(taskId: string, attachmentId: string) {
		const response = (await axiosWithAuth.delete(
			`tasks/${taskId}/attachments/${attachmentId}`
		)) as unknown as void

		return response
	}
}

export const attachmentService = new AttachmentService()
