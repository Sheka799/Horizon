'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MoreHorizontal, PencilIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import {
	Button,
	ConfirmDialog,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input
} from '@/shared/components/ui'

import {
	useBoardQuery,
	useDeleteBoardMutation,
	useUpdateBoardMutation
} from '../hooks'
import { BoardSchema, TypeBoardSchema } from '../schemes'

export function BoardMenu({ id }: { id: string }) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

	const { deleteBoard, isDeletingBoard } = useDeleteBoardMutation()

	const { board } = useBoardQuery(id)
	const form = useForm<TypeBoardSchema>({
		resolver: zodResolver(BoardSchema),
		values: {
			title: board?.title || ''
		}
	})

	const { updateBoard, isUpdatingBoard } = useUpdateBoardMutation()
	const onSubmit = (values: TypeBoardSchema) => {
		updateBoard({ id, dto: values })
		setIsEditDialogOpen(false)
	}

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
						<DropdownMenuItem
							onSelect={() => setIsEditDialogOpen(true)}
						>
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

			<ConfirmDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				title='Вы уверены, что хотите удалить эту доску?'
				description='Если вы удалите эту доску, все ее данные будут безвозвратно удалены'
				disabled={isDeletingBoard}
				onConfirm={() => deleteBoard(id)}
			/>

			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className='sm:max-w-sm'>
					<DialogHeader className='mb-5'>
						<DialogTitle>Редактировать доску</DialogTitle>
						<DialogDescription>
							Введите новое название доски
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Название доски</FormLabel>
										<FormControl>
											<Input
												disabled={isUpdatingBoard}
												placeholder='Введите название доски'
												type='text'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant='outline'>Отмена</Button>
								</DialogClose>
								<Button
									disabled={isUpdatingBoard}
									type='submit'
								>
									Сохранить
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	)
}
