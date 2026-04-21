'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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

import { useCreateColumnMutation } from '../hooks'
import { ColumnSchema, TypeColumnSchema } from '../schemes'

export function CreateColumnModal() {
	const [isOpen, setIsOpen] = useState(false)
	const params = useParams()
	const boardId = params.id as string

	const form = useForm<TypeColumnSchema>({
		resolver: zodResolver(ColumnSchema),
		defaultValues: {
			title: '',
			boardId: boardId
		}
	})

	const { createColumn, isCreatingColumn } = useCreateColumnMutation()

	const onSubmit = (values: TypeColumnSchema) => {
		createColumn({ title: values.title, boardId: values.boardId })
		form.reset()
		setIsOpen(false)
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<div className='h-fit'>
					<Tooltip>
						<TooltipTrigger asChild>
							<span className='h-fit'>
								<Button variant='ghost' className='h-8 w-8 p-0'>
									<Plus className='h-4 w-4' />
								</Button>
							</span>
						</TooltipTrigger>
						<TooltipContent>
							<p>Добавить колонку</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</DialogTrigger>
			<DialogContent className='sm:max-w-sm'>
				<DialogHeader className='mb-5'>
					<DialogTitle>Создать колонку</DialogTitle>
					<DialogDescription>
						Введите название новой колонки
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
							<Button disabled={isCreatingColumn} type='submit'>
								Создать
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
