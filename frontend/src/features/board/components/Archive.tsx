'use client'

import { ArrowLeft, MoreHorizontalIcon, RotateCcw, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

import {
	useDeleteTaskMutation,
	useUpdateTaskMutation
} from '@/features/task/hooks'

import {
	Button,
	ConfirmDialog,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/shared/components/ui'
import { ROUTES } from '@/shared/config'

import { useArchivedTasksQuery } from '../hooks'

import { ArchivePagination } from './ArchivePagination'
import { ArchiveSkeleton } from './ArchiveSkeleton'

export function Archive({ boardId }: { boardId: string }) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

	const { deleteTask, isDeletingTask } = useDeleteTaskMutation()
	const { updateTask, isUpdatingTask } = useUpdateTaskMutation()

	const handleRestore = (taskId: string) => {
		updateTask({ id: taskId, dto: { isArchived: false } })
	}

	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()

	const page = Number(searchParams.get('page')) || 1
	const limit = Number(searchParams.get('limit')) || 10

	const setPage = useCallback(
		(newPage: number) => {
			const params = new URLSearchParams(searchParams)
			params.set('page', newPage.toString())
			router.push(`${pathname}?${params.toString()}`)
		},
		[searchParams, router, pathname]
	)

	const setLimit = useCallback(
		(newLimit: number) => {
			const params = new URLSearchParams(searchParams)
			params.set('limit', newLimit.toString())
			params.set('page', '1')
			router.push(`${pathname}?${params.toString()}`)
		},
		[searchParams, router, pathname]
	)

	const { tasks, total, totalPages, isLoading, isFetching } =
		useArchivedTasksQuery(boardId, page, limit)

	const handleDeletePermanent = (taskId: string) => {
		setSelectedTaskId(taskId)
		setIsDeleteDialogOpen(true)
	}

	const handleDeleteOpenChange = (open: boolean) => {
		setIsDeleteDialogOpen(open)
		if (!open) setSelectedTaskId(null)
	}

	if (isLoading) {
		return <ArchiveSkeleton />
	}

	return (
		<>
			<div className='flex h-full flex-col'>
				<Link href={`${ROUTES.DASHBOARD.BOARD}/${boardId}`}>
					<Button variant='outline' size='sm'>
						<ArrowLeft className='mr-2 h-4 w-4' />
						Назад к доске
					</Button>
				</Link>
				<h1 className='mt-5 mb-4 text-2xl font-bold'>Архив задач</h1>
				{tasks && tasks?.length > 0 && (
					<p className='text-muted-foreground mb-4 text-sm'>
						Всего архивных задач:{' '}
						<span className='font-medium'>{total}</span>
					</p>
				)}
				{tasks?.length === 0 && (
					<p className='text-muted-foreground mb-4 text-sm'>
						Нет архивных задач
					</p>
				)}
				{tasks && tasks.length > 0 && (
					<div className='flex h-full flex-col gap-6'>
						<div className='flex flex-1 overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='w-[300px]'>
											Название задачи
										</TableHead>
										<TableHead>Статус</TableHead>
										<TableHead>Дата архивации</TableHead>
										<TableHead className='text-right'>
											Действия
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{tasks?.map(task => (
										<TableRow key={task.id}>
											<TableCell className='font-medium break-words whitespace-normal'>
												{task.name}
											</TableCell>
											<TableCell>
												{task.status === 'DONE' ? (
													<span className='text-green-600'>
														✅ Выполнена
													</span>
												) : (
													<span className='text-yellow-600'>
														📋 Не выполнена
													</span>
												)}
											</TableCell>
											<TableCell>
												{task.archivedAt
													? new Date(
															task.archivedAt
														).toLocaleDateString(
															'ru-RU'
														)
													: '—'}
											</TableCell>
											<TableCell className='text-right'>
												<DropdownMenu>
													<DropdownMenuTrigger
														asChild
													>
														<Button
															variant='ghost'
															size='icon'
															className='size-8'
														>
															<MoreHorizontalIcon className='h-4 w-4' />
															<span className='sr-only'>
																Открыть меню
															</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end'>
														<DropdownMenuItem
															disabled={
																isUpdatingTask
															}
															onSelect={() =>
																handleRestore(
																	task.id
																)
															}
														>
															<RotateCcw className='mr-2 h-4 w-4' />
															Восстановить
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															variant='destructive'
															onSelect={() =>
																handleDeletePermanent(
																	task.id
																)
															}
														>
															<Trash2 className='mr-2 h-4 w-4' />
															Удалить навсегда
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
						{totalPages && totalPages > 1 && (
							<ArchivePagination
								currentPage={page}
								totalPages={totalPages}
								pageSize={limit}
								onPageChange={setPage}
								onPageSizeChange={setLimit}
							/>
						)}
						{isFetching && (
							<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
								<div className='border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent' />
							</div>
						)}
					</div>
				)}
			</div>
			<ConfirmDialog
				open={isDeleteDialogOpen}
				onOpenChange={handleDeleteOpenChange}
				title='Вы уверены, что хотите удалить эту задачу?'
				disabled={isDeletingTask}
				onConfirm={() => {
					if (selectedTaskId) deleteTask(selectedTaskId)
				}}
			/>
		</>
	)
}
