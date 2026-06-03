'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

import { ITask } from '@/features/board/types'

import { DueDateDisplay, PriorityWithTooltip } from '@/shared/components/ui'

import { TaskMenu } from './TaskMenu'

interface TaskCardProps {
	task: ITask
	overlay?: boolean
	onTaskClick?: (taskId: string) => void
}

export function Task({ task, overlay, onTaskClick }: TaskCardProps) {
	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging
	} = useSortable({
		id: task.id,
		data: { type: 'task', task }
	})

	const [hasOpenDialog, setHasOpenDialog] = useState(false)

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	}

	const handleCardClick = (e: React.MouseEvent) => {
		if (hasOpenDialog) return

		const target = e.target as HTMLElement

		if (target.closest('button') || target.closest('[role="menuitem"]')) {
			return
		}

		onTaskClick?.(task.id)
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onClick={handleCardClick}
			className={`bg-card cursor-grab rounded-lg border p-3 shadow-xs active:cursor-grabbing ${
				isDragging ? 'opacity-50' : ''
			} ${overlay ? 'rotate-1 shadow-xl' : ''}`}
		>
			<div className='mb-2.5 flex items-center justify-end gap-2'>
				{task.priority && (
					<PriorityWithTooltip priority={task.priority} />
				)}
				<TaskMenu id={task.id} onDialogOpenChange={setHasOpenDialog} />
			</div>
			<p className='text-sm font-medium'>{task.name}</p>
			<div className='mt-2 text-xs'>
				{task.dueDate && <DueDateDisplay dueDate={task.dueDate} />}
			</div>
		</div>
	)
}