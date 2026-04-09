'use client'

import Link from 'next/link'

import {
	Card,
	CardFooter,
	CardHeader,
	CardTitle,
	Skeleton
} from '@/shared/components/ui'
import { ROUTES } from '@/shared/config'

import { useBoardsQuery } from '../hooks'

import { BoardModal } from './BoardModal'

function BoardSkeleton() {
	return (
		<Card className='@container/card'>
			<CardHeader>
				<Skeleton className='h-7 w-3/4' />
			</CardHeader>
			<CardFooter className='flex-col items-start gap-1.5'>
				<Skeleton className='h-4 w-1/2' />
			</CardFooter>
		</Card>
	)
}

export function Boards() {
	const { boards, isLoading } = useBoardsQuery()

	return (
		<div className='flex w-full flex-col'>
			<BoardModal />
			<div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
				{isLoading
					? Array.from({ length: 4 }).map((_, i) => (
							<BoardSkeleton key={i} />
						))
					: boards?.map(board => (
							<Link
								href={`${ROUTES.DASHBOARD.BOARD}/${board.id}`}
								key={board.id}
							>
								<Card className='@container/card'>
									<CardHeader>
										<CardTitle className='text-xl font-semibold tabular-nums @[250px]/card:text-2xl'>
											{board.title}
										</CardTitle>
									</CardHeader>
									<CardFooter className='flex-col items-start gap-1.5 text-sm' />
								</Card>
							</Link>
						))}
			</div>
		</div>
	)
}
