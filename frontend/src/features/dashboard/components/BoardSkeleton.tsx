import { Skeleton } from '@/shared/components/ui'

export function BoardSkeleton() {
	return (
		<div className='flex flex-1 gap-4 overflow-x-auto pb-4'>
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className='bg-muted/40 flex w-72 shrink-0 flex-col gap-3 h-fit rounded-lg border p-3'
				>
					<div className='flex items-center justify-between'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-4 w-4 rounded-full' />
					</div>

					<div className='flex flex-col gap-2'>
						{Array.from({ length: i + 2 }).map((_, j) => (
							<div
								key={j}
								className='bg-card rounded-lg border p-3'
							>
								<Skeleton className='h-4 w-full' />
								<Skeleton className='mt-2 h-3 w-1/2' />
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	)
}
