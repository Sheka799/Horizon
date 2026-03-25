import axios from 'axios'
import { toast } from 'sonner'

export function toastMessageHandler(response: unknown) {
    // Ошибка Axios
    if (axios.isAxiosError(response)) {
        const backendMessage = response.response?.data?.message

        if (backendMessage) {
            const firstDotIndex = backendMessage.indexOf('.')

            if (firstDotIndex !== -1) {
                toast.error(backendMessage.slice(0, firstDotIndex), {
                    description: backendMessage.slice(firstDotIndex + 1)
                })
            } else {
                toast.error(backendMessage)
            }
            return
        }
    }

    // Успешный ответ с message
    if (typeof response === 'object' && response !== null && 'message' in response) {
        const message = (response as { message: string }).message
        const firstDotIndex = message.indexOf('.')

        if (firstDotIndex !== -1) {
            toast.success(message.slice(0, firstDotIndex), {
                description: message.slice(firstDotIndex + 1)
            })
        } else {
            toast.success(message)
        }
        return
    }

    // Обычная ошибка
    if (response instanceof Error) {
        const errorMessage = response.message
        const firstDotIndex = errorMessage.indexOf('.')

        if (firstDotIndex !== -1) {
            toast.error(errorMessage.slice(0, firstDotIndex), {
                description: errorMessage.slice(firstDotIndex + 1)
            })
        } else {
            toast.error(errorMessage)
        }
        return
    }

    toast.error('Ошибка со стороны сервера')
}