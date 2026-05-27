'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { EPriority } from '@/features/dashboard/types'

import {
	Button,
	Calendar,
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
	Popover,
	PopoverContent,
	PopoverTrigger,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/shared/components/ui'

import { useCreateTaskMutation } from '../hooks'
import { TaskSchema, TypeTaskSchema } from '../schemes'

export function CreateTaskModal({ id }: { id: string }) {
	const [isOpen, setIsOpen] = useState(false)

	const form = useForm<TypeTaskSchema>({
		resolver: zodResolver(TaskSchema),
		defaultValues: {
			name: '',
			columnId: id,
			priority: '',
			dueDate: undefined
		}
	})

	const { createTask, isCreatingTask } = useCreateTaskMutation()

	const onSubmit = (values: TypeTaskSchema) => {
		createTask({
			name: values.name,
			columnId: values.columnId,
			priority: values.priority
				? (values.priority as EPriority)
				: EPriority.Medium,
			dueDate: values.dueDate
		})
		form.reset()
		setIsOpen(false)
	}

	// Обработка выбора даты
	const handleDateSelect = (date: Date | undefined) => {
		form.setValue('dueDate', date ? date.toISOString() : undefined)
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
							<p>Добавить задачу</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</DialogTrigger>
			<DialogContent className='sm:max-w-sm'>
				<DialogHeader className='mb-5'>
					<DialogTitle>Создать задачу</DialogTitle>
					<DialogDescription>
						Введите название новой задачи
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-5'
					>
						{/* Название */}
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Название задачи</FormLabel>
									<FormControl>
										<Input
											placeholder='Введите название задачи'
											type='text'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Приоритет */}
						<FormField
							control={form.control}
							name='priority'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Приоритет задачи</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Приоритет' />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectItem value='LOW'>
														Низкий
													</SelectItem>
													<SelectItem value='MEDIUM'>
														Средний
													</SelectItem>
													<SelectItem value='HIGH'>
														Высокий
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Дедлайн */}
						<FormField
							control={form.control}
							name='dueDate'
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormLabel>Дедлайн</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant='outline'
													className='w-full justify-start text-left font-normal'
												>
													<CalendarIcon className='mr-2 h-4 w-4' />
													{field.value
														? new Date(
																field.value
															).toLocaleDateString(
																'ru-RU'
															)
														: 'Выберите дату'}
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent
											className='w-auto p-0'
											align='start'
										>
											<Calendar
												mode='single'
												selected={
													field.value
														? new Date(field.value)
														: undefined
												}
												onSelect={handleDateSelect}
												disabled={(date: Date) =>
													date <
													new Date('1900-01-01')
												}
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<DialogClose asChild>
								<Button variant='outline'>Отмена</Button>
							</DialogClose>
							<Button disabled={isCreatingTask} type='submit'>
								Создать
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
