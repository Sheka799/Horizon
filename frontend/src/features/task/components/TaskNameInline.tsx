'use client'

import { useRef } from 'react'

import { useUpdateTaskMutation } from '../hooks'

interface TaskNameInlineProps {
	taskId: string
	value: string
	className?: string
}

export function TaskNameInline({
	taskId,
	value,
	className
}: TaskNameInlineProps) {
	const ref = useRef<HTMLHeadingElement>(null)
	const { updateTask } = useUpdateTaskMutation()

	const handleSubmit = () => {
		const newValue = ref.current?.textContent?.trim()
		if (!newValue || newValue === value) return
		updateTask(
			{ id: taskId, dto: { name: newValue } },
			{
				onError: () => {
					if (ref.current) ref.current.textContent = value
				}
			}
		)
	}

	return (
		<h3
			ref={ref}
			contentEditable
			suppressContentEditableWarning
			onBlur={handleSubmit}
			onKeyDown={e => {
				if (e.key === 'Enter') {
					e.preventDefault()
					ref.current?.blur()
				}
				if (e.key === 'Escape') {
					if (ref.current) ref.current.textContent = value
					ref.current?.blur()
				}
			}}
			className={`border-transparent border-2 cursor-text focus:border-2 focus:border-border px-1 rounded-md focus:outline-none ${className}`}
		>
			{value}
		</h3>
	)
}
