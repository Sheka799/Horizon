import { Flame } from 'lucide-react'

import { isOverdueOrToday } from '@/shared/utils'

export function DueDateDisplay({ dueDate }: { dueDate: string }) {
	const isOverdue = isOverdueOrToday(dueDate)
	const dateText = new Date(dueDate).toLocaleDateString('ru-RU')

	if (!isOverdue) {
		return <span className='text-muted-foreground'>{dateText}</span>
	}

	return (
		<span className='inline-flex items-center gap-1 font-medium text-red-400/90'>
			<Flame className='h-4 w-4 shrink-0' />
			{dateText}
		</span>
	)
}
