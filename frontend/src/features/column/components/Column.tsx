'use client'

import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { IColumn } from '@/features/dashboard/types'
import { CreateTaskModal, Task } from '@/features/task/components'

import { ColumnMenu } from './ColumnMenu'

interface BoardColumnProps {
	column: IColumn
	overlay?: boolean
}

export function Column({ column, overlay }: BoardColumnProps) {
	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging
	} = useSortable({
		id: column.id,
		data: { type: 'column', column }
	})

	const tasks = [...column.tasks].sort((a, b) =>
		a.order < b.order ? -1 : a.order > b.order ? 1 : 0
	)

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`bg-muted/40 relative flex h-fit w-72 shrink-0 flex-col gap-3 rounded-lg border p-3 ${
				isDragging ? 'opacity-50' : ''
			} ${overlay ? 'rotate-2 shadow-xl' : ''}`}
		>
			<div
				{...attributes}
				{...listeners}
				className='flex cursor-grab items-center justify-between gap-2 active:cursor-grabbing'
			>
				<div className='flex items-center gap-2 justify-between w-full'>
					<div className='flex items-center gap-2'>
						<h3 className='text-sm font-medium'>{column.title}</h3>
						{tasks.length > 0 && (
							<span className='text-muted-foreground text-md'>
								{tasks.length}
							</span>
						)}
					</div>
					<div className='flex align-center gap-1'>
						<CreateTaskModal id={column.id} />
						<ColumnMenu id={column.id} />
					</div>
				</div>
			</div>

			<SortableContext
				items={tasks.map(t => t.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className='flex flex-col gap-2'>
					{tasks.map(task => (
						<Task key={task.id} task={task} />
					))}
					{tasks.length === 0 && (
						<div className='text-muted-foreground rounded-lg border border-dashed p-4 text-center text-xs'>
							Нет задач
						</div>
					)}
				</div>
			</SortableContext>
		</div>
	)
}
