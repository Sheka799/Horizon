'use client'

import {
	Field,
	FieldLabel,
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/shared/components/ui'

interface ArchivePaginationProps {
	currentPage: number
	totalPages: number
	pageSize: number
	onPageChange: (page: number) => void
	onPageSizeChange: (size: number) => void
}

export function ArchivePagination({
	currentPage,
	totalPages,
	pageSize,
	onPageChange,
	onPageSizeChange
}: ArchivePaginationProps) {
	const getPageNumbers = () => {
		const pages: (number | string)[] = []
		const maxVisible = 3

		// Если страниц мало — показываем все
		if (totalPages <= maxVisible + 2) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i)
			}
			return pages
		}

		// Всегда добавляем первую страницу
		pages.push(1)

		if (currentPage <= 3) {
			// Начало: [1, 2, 3, 4, '...', totalPages]
			pages.push(2, 3, 4)
			pages.push('...')
			pages.push(totalPages)
		} else if (currentPage >= totalPages - 2) {
			// Конец: [1, '...', totalPages-3, totalPages-2, totalPages-1, totalPages]
			pages.push('...')
			pages.push(totalPages - 3, totalPages - 2, totalPages - 1)
			pages.push(totalPages)
		} else {
			// Середина: [1, '...', currentPage-1, currentPage, currentPage+1, '...', totalPages]
			pages.push('...')
			pages.push(currentPage - 1, currentPage, currentPage + 1)
			pages.push('...')
			pages.push(totalPages)
		}

		return pages
	}

	if (totalPages <= 1 && pageSize >= totalPages) return null

	return (
		<div className='mt-auto flex items-center justify-between gap-4'>
			<Field orientation='horizontal' className='w-fit'>
				<FieldLabel htmlFor='select-rows-per-page'>
					Задач на странице
				</FieldLabel>
				<Select
					value={pageSize.toString()}
					onValueChange={value => onPageSizeChange(Number(value))}
				>
					<SelectTrigger className='w-20' id='select-rows-per-page'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent align='start'>
						<SelectGroup>
							<SelectItem value='5'>5</SelectItem>
							<SelectItem value='10'>10</SelectItem>
							<SelectItem value='20'>20</SelectItem>
							<SelectItem value='50'>50</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</Field>

			<Pagination className='mx-0 w-auto'>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							text=''
							href='#'
							onClick={e => {
								e.preventDefault()
								if (currentPage > 1)
									onPageChange(currentPage - 1)
							}}
							className={
								currentPage === 1
									? 'pointer-events-none opacity-50'
									: ''
							}
						/>
					</PaginationItem>

					{getPageNumbers().map((page, index) => (
						<PaginationItem key={index}>
							{page === '...' ? (
								<PaginationEllipsis />
							) : (
								<PaginationLink
									href='#'
									onClick={e => {
										e.preventDefault()
										onPageChange(page as number)
									}}
									isActive={currentPage === page}
								>
									{page}
								</PaginationLink>
							)}
						</PaginationItem>
					))}

					<PaginationItem>
						<PaginationNext
							text=''
							href='#'
							onClick={e => {
								e.preventDefault()
								if (currentPage < totalPages)
									onPageChange(currentPage + 1)
							}}
							className={
								currentPage === totalPages
									? 'pointer-events-none opacity-50'
									: ''
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	)
}
