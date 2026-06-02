import { Skeleton } from '@/shared/components/ui'

export function ArchiveSkeleton() {
	return (
		<div className='flex h-full flex-col'>
			{/* Кнопка назад */}
			<div className='mb-4'>
				<Skeleton className='h-8 w-28' />
			</div>

			{/* Заголовок */}
			<Skeleton className='mb-4 h-8 w-48' />

			{/* Счетчик задач */}
			<Skeleton className='mb-4 h-5 w-32' />

			{/* Таблица */}
			<div className='flex flex-1 flex-col gap-6'>
				<div className='flex flex-1 overflow-x-auto'>
					<div className='w-full'>
						{/* Заголовки таблицы */}
						<div className='border-b'>
							<div className='flex py-3'>
								<div className='flex-1 px-4'>
									<Skeleton className='h-4 w-24' />
								</div>
								<div className='flex-1 px-4'>
									<Skeleton className='h-4 w-16' />
								</div>
								<div className='flex-1 px-4'>
									<Skeleton className='h-4 w-24' />
								</div>
								<div className='w-20 px-4 text-right'>
									<Skeleton className='ml-auto h-4 w-16' />
								</div>
							</div>
						</div>

						{/* Строки таблицы */}
						{Array.from({ length: 8 }).map((_, index) => (
							<div key={index} className='border-b'>
								<div className='flex py-3'>
									<div className='flex-1 px-4'>
										<Skeleton className='h-5 w-3/4' />
									</div>
									<div className='flex-1 px-4'>
										<Skeleton className='h-5 w-20' />
									</div>
									<div className='flex-1 px-4'>
										<Skeleton className='h-5 w-24' />
									</div>
									<div className='w-20 px-4 text-right'>
										<Skeleton className='ml-auto h-8 w-8 rounded-full' />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Пагинация (скелетон) */}
				<div className='mt-6 flex items-center justify-between gap-4'>
					<div className='flex items-center gap-2'>
						<Skeleton className='h-5 w-28' />
						<Skeleton className='h-8 w-20' />
					</div>
					<div className='flex items-center gap-1'>
						<Skeleton className='h-8 w-8 rounded-md' />
						<Skeleton className='h-8 w-8 rounded-md' />
						<Skeleton className='h-8 w-8 rounded-md' />
						<Skeleton className='h-8 w-8 rounded-md' />
						<Skeleton className='h-8 w-8 rounded-md' />
						<Skeleton className='h-8 w-8 rounded-md' />
					</div>
				</div>
			</div>
		</div>
	)
}
