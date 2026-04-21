'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { ITask } from '@/features/dashboard/types'

interface TaskCardProps {
	task: ITask
	overlay?: boolean
}

export function Task({ task, overlay }: TaskCardProps) {
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

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={`bg-card cursor-grab rounded-lg border p-3 shadow-xs active:cursor-grabbing ${
				isDragging ? 'opacity-50' : ''
			} ${overlay ? 'rotate-1 shadow-xl' : ''}`}
		>
			<p className='text-sm font-medium'>{task.name}</p>
			<div className='mt-2 flex items-center gap-2'>
				{task.priority && (
					<span className='text-muted-foreground text-xs'>
						{task.priority}
					</span>
				)}
				{task.dueDate && (
					<span className='text-muted-foreground text-xs'>
						{new Date(task.dueDate).toLocaleDateString('ru-RU')}
					</span>
				)}
			</div>
		</div>
	)
}
