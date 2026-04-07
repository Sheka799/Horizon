import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useRef, useState } from 'react'

import { IColumn, ITask } from '../types'

import { useMoveColumn } from './useMoveColumn'
import { useMoveTask } from './useMoveTask'

export function useBoardDnd(boardId: string, columns: IColumn[]) {
	const { mutate: moveColumn } = useMoveColumn(boardId)
	const { mutate: moveTask } = useMoveTask(boardId)

	const [activeColumn, setActiveColumn] = useState<IColumn | null>(null)
	const [activeTask, setActiveTask] = useState<ITask | null>(null)
	const lastMoveRef = useRef<string | null>(null)
	const columnsRef = useRef<IColumn[]>(columns)
	columnsRef.current = columns

	function onDragStart({ active }: DragStartEvent) {
		lastMoveRef.current = null
		if (active.data.current?.type === 'column')
			setActiveColumn(active.data.current.column)
		if (active.data.current?.type === 'task')
			setActiveTask(active.data.current.task)
	}

	function onDragEnd({ active, over }: DragEndEvent) {
		setActiveColumn(null)
		setActiveTask(null)
		lastMoveRef.current = null

		if (!over || active.id === over.id) return
		if (active.data.current?.type !== 'column') return

		const cols = columnsRef.current
		const oldIndex = cols.findIndex(c => c.id === active.id)
		const newIndex = cols.findIndex(c => c.id === over.id)
		if (oldIndex === newIndex) return

		const reordered = arrayMove(cols, oldIndex, newIndex)
		moveColumn({
			id: String(active.id),
			prevOrder: reordered[newIndex - 1]?.order ?? null,
			nextOrder: reordered[newIndex + 1]?.order ?? null
		})
	}

	function onDragOver({ active, over }: DragOverEvent) {
		if (!over || active.id === over.id) return
		if (active.data.current?.type !== 'task') return

		const moveKey = `${active.id}-${over.id}`
		if (lastMoveRef.current === moveKey) return
		lastMoveRef.current = moveKey

		const cols = columnsRef.current
		const activeTask = active.data.current.task as ITask
		const overType = over.data.current?.type

		if (overType === 'task') {
			const overTask = over.data.current?.task as ITask
			const tasks = [
				...(cols.find(c => c.id === overTask.columnId)?.tasks ?? [])
			].sort((a, b) => (a.order < b.order ? -1 : 1))
			const overIndex = tasks.findIndex(t => t.id === overTask.id)

			moveTask({
				id: activeTask.id,
				columnId: overTask.columnId,
				prevOrder: tasks[overIndex - 1]?.order ?? null,
				nextOrder: tasks[overIndex]?.order ?? null
			})
		}

		if (overType === 'column') {
			const tasks = [
				...(cols.find(c => c.id === over.id)?.tasks ?? [])
			].sort((a, b) => (a.order < b.order ? -1 : 1))

			moveTask({
				id: activeTask.id,
				columnId: String(over.id),
				prevOrder: tasks.at(-1)?.order ?? null,
				nextOrder: null
			})
		}
	}

	return { activeColumn, activeTask, onDragStart, onDragEnd, onDragOver }
}
