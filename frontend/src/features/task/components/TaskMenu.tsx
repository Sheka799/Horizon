'use client'

import { ArchiveIcon, MoreHorizontal, TrashIcon } from 'lucide-react'
import { useState } from 'react'

import {
	Button,
	ConfirmDialog,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/shared/components/ui'

import { useDeleteTaskMutation, useUpdateTaskMutation } from '../hooks'

interface TaskMenuProps {
	id: string
	onDialogOpenChange: (open: boolean) => void
}

export function TaskMenu({ id, onDialogOpenChange }: TaskMenuProps) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false)

	const { deleteTask, isDeletingTask } = useDeleteTaskMutation()
	const { updateTask, isUpdatingTask } = useUpdateTaskMutation()

	const handleDeleteOpenChange = (open: boolean) => {
		setIsDeleteDialogOpen(open)
		onDialogOpenChange(open)
	}

	const handleArchiveOpenChange = (open: boolean) => {
		setIsArchiveDialogOpen(open)
		onDialogOpenChange(open)
	}

	const handleArchive = () => {
		updateTask({ id, dto: { isArchived: true } })
		handleArchiveOpenChange(false)
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className='h-fit'>
						<Tooltip>
							<TooltipTrigger asChild>
								<span className='h-fit'>
									<Button
										variant='ghost'
										className='h-8 w-8 p-0'
									>
										<MoreHorizontal className='h-4 w-4' />
									</Button>
								</span>
							</TooltipTrigger>
							<TooltipContent>
								<p>Меню задачи</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuGroup>
						<DropdownMenuItem
							onSelect={() => handleArchiveOpenChange(true)}
						>
							<ArchiveIcon />
							Архивировать
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem
							variant='destructive'
							onSelect={() => {
								handleDeleteOpenChange(true)
							}}
						>
							<TrashIcon />
							Удалить навсегда
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<ConfirmDialog
				open={isDeleteDialogOpen}
				onOpenChange={handleDeleteOpenChange}
				title='Вы уверены, что хотите удалить эту задачу?'
				disabled={isDeletingTask}
				onConfirm={() => deleteTask(id)}
			/>

			<ConfirmDialog
				open={isArchiveDialogOpen}
				onOpenChange={handleArchiveOpenChange}
				title='Переместить задачу в архив?'
				confirmText='Архивировать'
				disabled={isUpdatingTask}
				onConfirm={handleArchive}
			/>
		</>
	)
}
