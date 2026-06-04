'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { useBoardQuery } from '@/features/board/hooks'

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/shared/components/ui'

import { useMoveTaskMutation, useTaskQuery } from '../hooks'

import { TaskDetailsSkeleton } from './TaskDetailsSkeleton'
import { TaskPriorityInline } from './TaskPriorityInline'
import { TaskDueDateInline } from './TaskDueDateInline'

const DATE_FORMAT = {
	day: 'numeric' as const,
	month: 'long' as const,
	year: 'numeric' as const,
	hour: '2-digit' as const,
	minute: '2-digit' as const
}

export function TaskDetails({ taskId }: { taskId: string }) {
	const params = useParams()
	const boardId = params.id as string
	const { task, isLoading: taskLoading } = useTaskQuery(taskId)
	const { board, isLoading: boardLoading } = useBoardQuery(boardId)
	const moveTaskMutation = useMoveTaskMutation(boardId)

	const [isMoving, setIsMoving] = useState(false)

	const handleMoveTask = async (newColumnId: string) => {
		if (!task || !currentColumn) return

		if (newColumnId === currentColumn.id) return

		setIsMoving(true)

		try {
			const targetColumn = board?.columns.find(
				col => col.id === newColumnId
			)
			if (!targetColumn) {
				setIsMoving(false)
				return
			}

			const tasks = targetColumn.tasks || []
			const lastTask = tasks[tasks.length - 1]
			const prevOrder = lastTask?.order ?? null
			const nextOrder = null

			await moveTaskMutation.mutateAsync({
				id: task.id,
				columnId: newColumnId,
				prevOrder,
				nextOrder
			})
		} catch (error) {
			console.error('Failed to move task:', error)
			toast.error('Не удалось переместить задачу')
		} finally {
			setIsMoving(false)
		}
	}

	if (taskLoading || boardLoading) {
		return <TaskDetailsSkeleton />
	}

	if (!task) {
		return (
			<div className='text-center'>
				<p className='text-muted-foreground'>Задача не найдена</p>
			</div>
		)
	}

	const currentColumn = board?.columns?.find(
		column => column.id === task.columnId
	)

	return (
		<div className='space-y-6'>
			<div>
				<p className='text-muted-foreground text-[12px]'>
					Создано{' '}
					{new Date(task.createdAt).toLocaleString(
						'ru-RU',
						DATE_FORMAT
					)}
					, обновлено{' '}
					{new Date(task.updatedAt).toLocaleString(
						'ru-RU',
						DATE_FORMAT
					)}
				</p>
			</div>

			<h3 className='text-lg font-bold'>{task.name}</h3>
			<hr />

			<ul className='flex flex-col gap-5'>
				{/* Статус */}
				<li className='grid grid-cols-[120px_1fr] items-center gap-1'>
					<h4 className='text-sm font-semibold'>Статус</h4>
					<Select
						value={currentColumn?.id || ''}
						onValueChange={value => handleMoveTask(value)}
						disabled={isMoving || boardLoading}
					>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='Статус' />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{board?.columns.map(column => (
									<SelectItem
										key={column.id}
										value={column.id}
									>
										{column.title}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</li>

				{/* Приоритет */}
				<li className='grid grid-cols-[120px_1fr] items-center gap-1'>
					<h4 className='text-sm font-semibold'>Приоритет</h4>
					<TaskPriorityInline task={task} />
				</li>

				{/* Дедлайн */}
				<li className='grid grid-cols-[120px_1fr] items-center gap-1'>
					<h4 className='text-sm font-semibold'>Дедлайн</h4>
					<TaskDueDateInline task={task} />
				</li>
			</ul>
		</div>
	)
}
