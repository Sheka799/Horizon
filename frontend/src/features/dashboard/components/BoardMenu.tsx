'use client'

import { MoreHorizontal, PencilIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/shared/components/ui'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/shared/components/ui'

import { useDeleteBoardMutation } from '../hooks'

export function BoardMenu({ id }: { id: string }) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const { deleteBoard, isDeletingBoard } = useDeleteBoardMutation()

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						className='absolute top-1 right-1 h-8 w-8 p-0'
					>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<PencilIcon />
							Редактировать
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
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
							Вы уверены, что хотите удалить эту доску?
						</AlertDialogTitle>
						<AlertDialogDescription>
							Если вы удалите эту доску, все ее данные будут
							безвозвратно удалены
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Отмена</AlertDialogCancel>
						<AlertDialogAction
							disabled={isDeletingBoard}
							onClick={() => deleteBoard(id)}
						>
							Продолжить
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
