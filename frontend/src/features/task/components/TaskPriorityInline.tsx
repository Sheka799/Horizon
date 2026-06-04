import { useEffect, useState } from 'react'

import { EPriority, ITask } from '@/features/board/types'

import {
	PriorityWithTooltip,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/shared/components/ui'

import { useUpdateTaskMutation } from '../hooks'

export function TaskPriorityInline({ task }: { task: ITask }) {
	const [isEditing, setIsEditing] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const { updateTask } = useUpdateTaskMutation()

	const handleChange = (value: string) => {
		updateTask({ id: task.id, dto: { priority: value as EPriority } })
		setIsEditing(false)
		setIsOpen(false)
	}

	useEffect(() => {
		if (isEditing) {
			setIsOpen(true)
		}
	}, [isEditing])

	if (isEditing) {
		return (
			<Select
				value={task.priority || 'MEDIUM'}
				onValueChange={handleChange}
				open={isOpen}
				onOpenChange={open => {
					setIsOpen(open)
					if (!open) setIsEditing(false)
				}}
			>
				<SelectTrigger className='w-full'>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value='LOW'>Низкий</SelectItem>
						<SelectItem value='MEDIUM'>Средний</SelectItem>
						<SelectItem value='HIGH'>Высокий</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		)
	}

	return (
		<div
			onClick={() => setIsEditing(true)}
			className='hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 flex h-8 w-fit cursor-pointer items-center rounded-lg border border-transparent px-2 py-1'
		>
			{task.priority ? (
				<PriorityWithTooltip priority={task.priority} showLabel />
			) : (
				<span className='text-muted-foreground'>—</span>
			)}
		</div>
	)
}
