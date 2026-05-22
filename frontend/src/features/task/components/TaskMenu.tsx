'use client'

import { MoreHorizontal, TrashIcon } from 'lucide-react'
import { useState } from 'react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/shared/components/ui'

import { useDeleteTaskMutation } from '../hooks'

export function TaskMenu({ id }: { id: string }) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const { deleteTask, isDeletingTask } = useDeleteTaskMutation()

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
							variant='destructive'
							onSelect={() => {
								setIsDeleteDialogOpen(true)
							}}
						>
							<TrashIcon />
							Удалить
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Вы уверены, что хотите удалить эту задачу?
						</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Отмена</AlertDialogCancel>
						<AlertDialogAction
							disabled={isDeletingTask}
							onClick={() => deleteTask(id)}
						>
							Продолжить
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
