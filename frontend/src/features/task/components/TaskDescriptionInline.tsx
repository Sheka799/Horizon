'use client'

import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, type JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Check, Pencil, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { ITask } from '@/features/board/types'

import { Button } from '@/shared/components/ui'
import { formatBytes, isSafeUrl } from '@/shared/utils'

import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from '../constants'
import {
	useDeleteAttachmentMutation,
	useUploadAttachmentMutation
} from '../hooks'
import { useUpdateTaskMutation } from '../hooks'
import {
	insertUploadingNode,
	removeUploadingNode,
	replaceUploadingNode,
	updateUploadingProgress
} from '../utils'

import { FileAttachment } from './FileAttachment'
import { TaskDescriptionToolbar } from './TaskDescriptionToolbar'
import { TaskDescriptionView } from './TaskDescriptionView'
import { UploadingFile } from './UploadingFile'

interface TaskDescriptionInlineProps {
	task: ITask
}

export function TaskDescriptionInline({ task }: TaskDescriptionInlineProps) {
	const [isEditing, setIsEditing] = useState(false)

	const imageInputRef = useRef<HTMLInputElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const uploadedDuringSessionRef = useRef<Set<string>>(new Set())

	const { updateTask, isUpdatingTask } = useUpdateTaskMutation()
	const { uploadAttachment, isUploadingAttachment } =
		useUploadAttachmentMutation(task.id)
	const { deleteAttachment } = useDeleteAttachmentMutation(task.id)

	const editor = useEditor({
		extensions: [
			StarterKit,
			Link.configure({ openOnClick: false }),
			Image,
			FileAttachment,
			UploadingFile,
			Placeholder.configure({
				placeholder: 'Добавьте описание задачи...'
			})
		],
		content: (task.description as JSONContent) ?? '',
		editable: isEditing,
		immediatelyRender: false
	})

	const handleStartEditing = () => {
		setIsEditing(true)
		uploadedDuringSessionRef.current = new Set()
		editor?.setEditable(true)
	}

	const handleCancel = () => {
		editor?.commands.setContent((task.description as JSONContent) ?? '')
		editor?.setEditable(false)
		setIsEditing(false)

		uploadedDuringSessionRef.current.forEach(attachmentId => {
			deleteAttachment(attachmentId)
		})
		uploadedDuringSessionRef.current = new Set()
	}

	const handleSave = () => {
		if (!editor) return

		updateTask(
			{ id: task.id, dto: { description: editor.getJSON() } },
			{
				onSuccess: () => {
					setIsEditing(false)
					editor.setEditable(false)
					uploadedDuringSessionRef.current = new Set()
				}
			}
		)
	}

	const handleImagePick = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0]
		event.target.value = ''
		if (!file || !editor) return

		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			toast.error('Неподдерживаемый формат изображения')
			return
		}
		if (file.size > MAX_FILE_SIZE_BYTES) {
			toast.error(`Файл больше ${formatBytes(MAX_FILE_SIZE_BYTES)}`)
			return
		}

		// Генерируем уникальный id для этой конкретной загрузки
		const uploadId = crypto.randomUUID()

		// Сразу вставляем placeholder с прогресс-баром в редактор
		insertUploadingNode(editor, uploadId, file.name, true)

		const attachment = await uploadAttachment({
			file,
			onProgress: percent => {
				updateUploadingProgress(editor, uploadId, percent)
			}
		}).catch(() => null)

		if (!attachment) {
			removeUploadingNode(editor, uploadId)
			return
		}

		if (!isSafeUrl(attachment.url)) {
			removeUploadingNode(editor, uploadId)
			deleteAttachment(attachment.id)
			toast.error('Сервер вернул небезопасную ссылку на файл')
			return
		}

		uploadedDuringSessionRef.current.add(attachment.id)

		// Заменяем placeholder на реальную image-ноду
		replaceUploadingNode(editor, uploadId, {
			type: 'image',
			attrs: { src: attachment.url, alt: attachment.name }
		})
	}

	const handleFilePick = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0]
		event.target.value = ''
		if (!file || !editor) return

		if (file.size > MAX_FILE_SIZE_BYTES) {
			toast.error(`Файл больше ${formatBytes(MAX_FILE_SIZE_BYTES)}`)
			return
		}

		const uploadId = crypto.randomUUID()

		insertUploadingNode(editor, uploadId, file.name, false)

		const attachment = await uploadAttachment({
			file,
			onProgress: percent => {
				updateUploadingProgress(editor, uploadId, percent)
			}
		}).catch(() => null)

		if (!attachment) {
			removeUploadingNode(editor, uploadId)
			return
		}

		if (!isSafeUrl(attachment.url)) {
			removeUploadingNode(editor, uploadId)
			deleteAttachment(attachment.id)
			toast.error('Сервер вернул небезопасную ссылку на файл')
			return
		}

		uploadedDuringSessionRef.current.add(attachment.id)

		// Заменяем placeholder на реальную file-ноду
		replaceUploadingNode(editor, uploadId, {
			type: 'file',
			attrs: {
				url: attachment.url,
				name: attachment.name,
				mimetype: attachment.mimetype,
				size: attachment.size
			}
		})
	}

	if (!editor) return null

	if (!isEditing) {
		return (
			<div className='group relative'>
				<TaskDescriptionView content={task.description} />
				<Button
					type='button'
					variant='ghost'
					size='icon'
					onClick={handleStartEditing}
					className='absolute top-0 right-0 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100'
				>
					<Pencil className='h-3.5 w-3.5' />
				</Button>
			</div>
		)
	}

	return (
		<div>
			<TaskDescriptionToolbar
				editor={editor}
				onImageButtonClick={() => imageInputRef.current?.click()}
				onFileButtonClick={() => fileInputRef.current?.click()}
			/>

			<EditorContent
				editor={editor}
				className='prose prose-sm dark:prose-invert min-h-32 max-w-none rounded-b-md border p-3 text-sm [&_.ProseMirror]:outline-none'
			/>

			<div className='mt-2 flex justify-end gap-2'>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={handleCancel}
					disabled={isUpdatingTask}
				>
					<X className='mr-1 h-3.5 w-3.5' />
					Отмена
				</Button>
				<Button
					type='button'
					size='sm'
					onClick={handleSave}
					disabled={isUpdatingTask || isUploadingAttachment}
				>
					<Check className='mr-1 h-3.5 w-3.5' />
					Сохранить
				</Button>
			</div>

			<input
				ref={imageInputRef}
				type='file'
				accept={ALLOWED_IMAGE_TYPES.join(',')}
				hidden
				onChange={handleImagePick}
			/>
			<input
				ref={fileInputRef}
				type='file'
				hidden
				onChange={handleFilePick}
			/>
		</div>
	)
}
