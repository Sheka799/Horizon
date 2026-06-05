import { Flame } from 'lucide-react'

import { ETaskStatus, ITask } from '@/features/board/types'

import { isOverdueOrToday } from '@/shared/utils'

export function DueDateDisplay({ task }: { task: ITask }) {
	if (!task.dueDate) {
		return <span className='text-muted-foreground'>—</span>
	}

	const isOverdue = isOverdueOrToday(task.dueDate)
	const dateText = new Date(task.dueDate).toLocaleDateString('ru-RU')

	if (!isOverdue || task.status === ETaskStatus.Done) {
		return <span className='text-muted-foreground'>{dateText}</span>
	}

	return (
		<span className='inline-flex items-center gap-1 font-medium text-red-400/90'>
			<Flame className='h-4 w-4 shrink-0' />
			{dateText}
		</span>
	)
}
