'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MoreHorizontal, PencilIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { IColumn } from '@/features/dashboard/types'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
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
	Input,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/shared/components/ui'

import { useDeleteColumnMutation, useUpdateColumnMutation } from '../hooks'
import { ColumnSchema, TypeColumnSchema } from '../schemes'

export function ColumnMenu({ column }: { column: IColumn }) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

	const { deleteColumn, isDeletingColumn } = useDeleteColumnMutation()
	const form = useForm<TypeColumnSchema>({
		resolver: zodResolver(ColumnSchema),
		values: {
			title: column?.title || '',
			boardId: column?.boardId || ''
		}
	})

	const { updateColumn, isUpdatingColumn } = useUpdateColumnMutation()
	const onSubmit = (values: TypeColumnSchema) => {
		updateColumn({ id: column.id, dto: values })
		setIsEditDialogOpen(false)
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
								<p>Меню колонки</p>
							</TooltipContent>
						</Tooltip>
					</div>
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

			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Вы уверены, что хотите удалить эту колонку?
						</AlertDialogTitle>
						<AlertDialogDescription>
							Если вы удалите эту колонку, все ее данные будут
							безвозвратно удалены
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Отмена</AlertDialogCancel>
						<AlertDialogAction
							disabled={isDeletingColumn}
							onClick={() => deleteColumn(column.id)}
						>
							Продолжить
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className='sm:max-w-sm'>
					<DialogHeader className='mb-5'>
						<DialogTitle>Редактировать колонку</DialogTitle>
						<DialogDescription>
							Введите новое название колонки
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Название колонки</FormLabel>
										<FormControl>
											<Input
												disabled={isUpdatingColumn}
												placeholder='Введите название колонки'
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
									disabled={isUpdatingColumn}
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
