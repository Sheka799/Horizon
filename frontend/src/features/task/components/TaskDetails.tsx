'use client'

import { PriorityWithTooltip } from '@/shared/components/ui'

import { useTaskQuery } from '../hooks'

import { TaskDetailsSkeleton } from './TaskDetailsSkeleton'

const DATE_FORMAT = {
	day: 'numeric' as const,
	month: 'long' as const,
	year: 'numeric' as const,
	hour: '2-digit' as const,
	minute: '2-digit' as const
}

export function TaskDetails({ taskId }: { taskId: string }) {
	const { task, isLoading } = useTaskQuery(taskId)

	if (isLoading) {
		return <TaskDetailsSkeleton />
	}

	if (!task) {
		return (
			<div className='text-center'>
				<p className='text-muted-foreground'>Задача не найдена</p>
			</div>
		)
	}

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
				{/* Приоритет */}
				<li className='grid grid-cols-[120px_1fr] items-center gap-1'>
					<h4 className='text-sm font-semibold'>Приоритет</h4>
					{task.priority ? (
						<PriorityWithTooltip
							priority={task.priority}
							showLabel={true}
						/>
					) : (
						<span className='text-muted-foreground'>—</span>
					)}
				</li>

				{/* Дедлайн */}
				<li className='grid grid-cols-[120px_1fr] items-center gap-1'>
					<h4 className='text-sm font-semibold'>Дедлайн</h4>
					<p className='text-muted-foreground text-sm'>
						{task.dueDate
							? new Date(task.dueDate).toLocaleDateString('ru-RU')
							: '—'}
					</p>
				</li>
			</ul>
		</div>
	)
}
