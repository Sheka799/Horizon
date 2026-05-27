'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'

import { ITask } from '@/features/dashboard/types'

import { PriorityWithTooltip } from '@/shared/components/ui'

import { TaskMenu } from './TaskMenu'
import { TaskSheet } from './TaskSheet'

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
	const [isSheetOpen, setIsSheetOpen] = useState(false)
	const [selectedTaskId, setSelectedTaskId] = useState<string>('')
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	}

	useEffect(() => {
		if (!isSheetOpen) {
			const timeoutId = setTimeout(() => setSelectedTaskId(''), 300)
			return () => clearTimeout(timeoutId)
		}
	}, [isSheetOpen])

	const handleCardClick = (e: React.MouseEvent) => {
		if (isDeleteDialogOpen) return

		const target = e.target as HTMLElement

		if (target.closest('button') || target.closest('[role="menuitem"]')) {
			return
		}

		setSelectedTaskId(task.id)
		setIsSheetOpen(true)
	}

	const handleSheetClose = (open: boolean) => {
		setIsSheetOpen(open)
	}

	return (
		<>
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
					<TaskMenu
						id={task.id}
						isDeleteDialogOpen={isDeleteDialogOpen}
						onOpenChange={setIsDeleteDialogOpen}
					/>
				</div>
				<p className='text-sm font-medium'>{task.name}</p>
				<div className='mt-2 flex items-center gap-2'>
					{task.dueDate && (
						<span className='text-muted-foreground text-xs'>
							{new Date(task.dueDate).toLocaleDateString('ru-RU')}
						</span>
					)}
				</div>
			</div>
			<TaskSheet
				taskId={selectedTaskId}
				open={isSheetOpen}
				onOpenChange={handleSheetClose}
			/>
		</>
	)
}
