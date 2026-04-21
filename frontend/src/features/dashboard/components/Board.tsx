'use client'

import {
	DndContext,
	DragOverlay,
	PointerSensor,
	closestCorners,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import {
	SortableContext,
	horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'

import { Column } from '@/features/column/components'
import { Task } from '@/features/task/components'

import {
	Button,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/shared/components/ui'

import { useBoardQuery } from '../hooks'
import { useBoardDnd } from '../hooks'

import { BoardSkeleton } from './BoardSkeleton'

export function Board({ id }: { id: string }) {
	const { board, isLoading } = useBoardQuery(id)

	const columns = [...(board?.columns ?? [])].sort((a, b) =>
		a.order < b.order ? -1 : a.order > b.order ? 1 : 0
	)

	const { activeColumn, activeTask, onDragStart, onDragEnd, onDragOver } =
		useBoardDnd(id, columns)

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
	)

	if (isLoading) return <BoardSkeleton />
	if (!board) return <div>Доска не найдена.</div>

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			onDragOver={onDragOver}
		>
			<div className='flex flex-1 gap-4 overflow-x-auto pb-4'>
				<SortableContext
					items={columns.map(c => c.id)}
					strategy={horizontalListSortingStrategy}
				>
					{columns.map(column => (
						<Column key={column.id} column={column} />
					))}
				</SortableContext>
				<Tooltip>
					<TooltipTrigger asChild>
						<span className='h-fit'>
							<Button variant='ghost' className='h-8 w-8 p-0'>
								<Plus className='h-4 w-4' />
							</Button>
						</span>
					</TooltipTrigger>
					<TooltipContent>
						<p>Добавить колонку</p>
					</TooltipContent>
				</Tooltip>
			</div>

			<DragOverlay>
				{activeColumn && <Column column={activeColumn} overlay />}
				{activeTask && <Task task={activeTask} overlay />}
			</DragOverlay>
		</DndContext>
	)
}
