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

import { useBoard } from '../hooks'
import { useBoardDnd } from '../hooks/useBoardDnd'

import { BoardColumn } from './BoardColumn'
import { BoardSkeleton } from './BoardSkeleton'
import { TaskCard } from './TaskCard'

export function Board({ id }: { id: string }) {
	const { board, isLoading } = useBoard(id)

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
						<BoardColumn key={column.id} column={column} />
					))}
				</SortableContext>
			</div>

			<DragOverlay>
				{activeColumn && <BoardColumn column={activeColumn} overlay />}
				{activeTask && <TaskCard task={activeTask} overlay />}
			</DragOverlay>
		</DndContext>
	)
}
