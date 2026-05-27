import { Skeleton } from '@/shared/components/ui'

export function TaskDetailsSkeleton() {
	return (
		<div className='space-y-6'>
			{/* Дата создания/обновления */}
			<div>
				<Skeleton className='h-3 w-full' />
			</div>

			{/* Название задачи */}
			<Skeleton className='h-6 w-3/4' />

			<hr />

			{/* Список свойств */}
			<ul className='flex flex-col gap-5'>
				{/* Приоритет */}
				<li className='grid grid-cols-[120px_1fr] items-center gap-1'>
					<Skeleton className='h-4 w-20' />
					<Skeleton className='h-6 w-24' />
				</li>

				{/* Дедлайн */}
				<li className='grid grid-cols-[120px_1fr] items-center gap-1'>
					<Skeleton className='h-4 w-20' />
					<Skeleton className='h-4 w-32' />
				</li>
			</ul>
		</div>
	)
}
