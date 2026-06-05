import { useState } from 'react'

import { ITask } from '@/features/board/types'

import {
	Button,
	Calendar,
	DueDateDisplay,
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/shared/components/ui'

import { useUpdateTaskMutation } from '../hooks'

export function TaskDueDateInline({ task }: { task: ITask }) {
	const { updateTask } = useUpdateTaskMutation()
	const [isOpen, setIsOpen] = useState(false)

	const handleDateSelect = (date: Date | undefined) => {
		updateTask({
			id: task.id,
			dto: { dueDate: date ? date.toISOString() : undefined }
		})
		setIsOpen(false)
	}

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='ghost'
					className='h-auto !w-fit px-2 py-1 text-left font-normal'
				>
					<DueDateDisplay task={task} />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0' align='start'>
				<Calendar
					mode='single'
					selected={task.dueDate ? new Date(task.dueDate) : undefined}
					onSelect={handleDateSelect}
				/>
			</PopoverContent>
		</Popover>
	)
}
