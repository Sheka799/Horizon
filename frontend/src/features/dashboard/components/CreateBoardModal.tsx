'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input
} from '@/shared/components/ui'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/shared/components/ui'

import { useCreateBoardMutation } from '../hooks'
import { BoardSchema, TypeBoardSchema } from '../schemes'

export function CreateBoardModal() {
	const form = useForm<TypeBoardSchema>({
		resolver: zodResolver(BoardSchema),
		defaultValues: {
			title: ''
		}
	})

	const { createBoard, isCreatingBoard } = useCreateBoardMutation()

	const onSubmit = (values: TypeBoardSchema) => {
		createBoard({ values })
		form.reset()
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='hover:bg-primary/90 hover:text-primary-foreground mb-5 duration-200 ease-linear'>
					Создать доску
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-sm'>
				<DialogHeader className='mb-5'>
					<DialogTitle>Создать доску</DialogTitle>
					<DialogDescription>
						Введите название новой доски
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
							<Button disabled={isCreatingBoard} type='submit'>
								Создать
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
