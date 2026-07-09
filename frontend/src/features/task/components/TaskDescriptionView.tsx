'use client'

import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { EditorContent, type JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { FileAttachment } from './FileAttachment'

interface TaskDescriptionViewProps {
	content: unknown
}

export function TaskDescriptionView({ content }: TaskDescriptionViewProps) {
	const editor = useEditor({
		extensions: [StarterKit, Link, Image, FileAttachment],
		content: (content as JSONContent) ?? '',
		editable: false,
		immediatelyRender: false
	})

	if (!content) {
		return (
			<p className='text-muted-foreground text-sm italic'>
				Описание не добавлено
			</p>
		)
	}

	return (
		<EditorContent
			editor={editor}
			className='prose prose-sm dark:prose-invert max-w-none text-sm [&_.ProseMirror]:outline-none'
		/>
	)
}
