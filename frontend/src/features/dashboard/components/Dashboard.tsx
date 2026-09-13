'use client'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
	CalendarClock,
	CheckCircle2,
	Flame,
	LayoutGrid,
	ListTodo
} from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	Tooltip as ChartTooltip,
	ResponsiveContainer,
	XAxis
} from 'recharts'

import { useBoardStatsQuery } from '@/features/board/hooks'
import { useProfile } from '@/features/user/hooks'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	DueDateDisplay,
	PriorityWithTooltip,
	Skeleton
} from '@/shared/components/ui'
import { ROUTES } from '@/shared/config'

const CARD_GRADIENT =
	'*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs'

function StatCard({
	label,
	value,
	icon: Icon
}: {
	label: string
	value: number
	icon: React.ElementType
}) {
	return (
		<Card className='@container/card'>
			<CardHeader>
				<CardDescription className='flex items-center gap-1.5'>
					<Icon className='h-4 w-4' />
					{label}
				</CardDescription>
				<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
					{value}
				</CardTitle>
			</CardHeader>
		</Card>
	)
}

function StatCardSkeleton() {
	return (
		<Card className='@container/card'>
			<CardHeader>
				<Skeleton className='h-4 w-1/2' />
				<Skeleton className='h-8 w-1/3' />
			</CardHeader>
		</Card>
	)
}

export function Dashboard() {
	const { user } = useProfile()
	const { stats, isLoading } = useBoardStatsQuery()

	const chartData = useMemo(
		() =>
			stats?.activity.map(point => ({
				date: format(new Date(point.date), 'd MMM', { locale: ru }),
				completed: point.count
			})) ?? [],
		[stats?.activity]
	)

	const upcomingDeadlines = stats?.upcomingDeadlines ?? []

	const firstName = user?.displayName?.split(' ')[0]
	const isEmpty = !isLoading && stats?.boardsCount === 0

	return (
		<div className='flex w-full flex-col gap-6'>
			<div>
				<h2 className='text-xl font-semibold'>
					{firstName ? `Привет, ${firstName}!` : 'С возвращением!'}
				</h2>
				<p className='text-muted-foreground text-sm capitalize'>
					{format(new Date(), 'd MMMM yyyy, EEEE', { locale: ru })}
				</p>
			</div>

			{isEmpty ? (
				<Card className='@container/card items-center py-12 text-center'>
					<CardHeader className='w-full'>
						<CardTitle>Пока нет ни одной доски</CardTitle>
						<CardDescription>
							Создайте первую доску, чтобы начать отслеживать
							задачи
						</CardDescription>
					</CardHeader>
					<CardFooter>
						<Link
							href={ROUTES.DASHBOARD.BOARDS}
							className='text-primary text-sm font-medium hover:underline'
						>
							Перейти к доскам →
						</Link>
					</CardFooter>
				</Card>
			) : (
				<>
					<div
						className={`grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 ${CARD_GRADIENT}`}
					>
						{isLoading || !stats ? (
							Array.from({ length: 4 }).map((_, i) => (
								<StatCardSkeleton key={i} />
							))
						) : (
							<>
								<StatCard
									label='Всего досок'
									value={stats.boardsCount}
									icon={LayoutGrid}
								/>
								<StatCard
									label='Активные задачи'
									value={stats.activeTasksCount}
									icon={ListTodo}
								/>
								<StatCard
									label='Просрочено'
									value={stats.overdueTasksCount}
									icon={Flame}
								/>
								<StatCard
									label='Выполнено за 7 дней'
									value={stats.doneLastWeekCount}
									icon={CheckCircle2}
								/>
							</>
						)}
					</div>

					<div className='grid grid-cols-1 gap-4 @4xl/main:grid-cols-3'>
						<Card className='@container/card @4xl/main:col-span-2'>
							<CardHeader>
								<CardTitle>Активность за 14 дней</CardTitle>
								<CardDescription>
									Количество выполненных задач по дням
								</CardDescription>
							</CardHeader>
							<CardContent className='h-64'>
								{isLoading ? (
									<Skeleton className='h-full w-full' />
								) : (
									<ResponsiveContainer
										width='100%'
										height='100%'
									>
										<AreaChart data={chartData}>
											<defs>
												<linearGradient
													id='fillCompleted'
													x1='0'
													y1='0'
													x2='0'
													y2='1'
												>
													<stop
														offset='5%'
														stopColor='var(--chart-1)'
														stopOpacity={0.8}
													/>
													<stop
														offset='95%'
														stopColor='var(--chart-1)'
														stopOpacity={0.05}
													/>
												</linearGradient>
											</defs>
											<CartesianGrid
												vertical={false}
												strokeDasharray='3 3'
												className='stroke-border'
											/>
											<XAxis
												dataKey='date'
												tickLine={false}
												axisLine={false}
												tickMargin={8}
												interval={2}
												className='fill-muted-foreground text-xs'
											/>
											<ChartTooltip
												contentStyle={{
													background: 'var(--card)',
													border: '1px solid var(--border)',
													borderRadius: '8px',
													fontSize: '12px'
												}}
												labelStyle={{
													color: 'var(--foreground)'
												}}
											/>
											<Area
												dataKey='completed'
												name='Выполнено'
												type='monotone'
												fill='url(#fillCompleted)'
												stroke='var(--chart-1)'
												strokeWidth={2}
											/>
										</AreaChart>
									</ResponsiveContainer>
								)}
							</CardContent>
						</Card>

						<Card className='@container/card'>
							<CardHeader>
								<CardTitle>Ближайшие дедлайны</CardTitle>
								<CardDescription>
									Задачи, требующие внимания
								</CardDescription>
							</CardHeader>
							<CardContent className='flex flex-col gap-3'>
								{isLoading ? (
									Array.from({ length: 4 }).map((_, i) => (
										<Skeleton
											key={i}
											className='h-12 w-full'
										/>
									))
								) : upcomingDeadlines.length === 0 ? (
									<div className='text-muted-foreground flex flex-col items-center gap-2 py-6 text-sm'>
										<CalendarClock className='h-5 w-5' />
										Нет задач с дедлайном
									</div>
								) : (
									upcomingDeadlines.map(task => (
										<Link
											key={task.id}
											href={`${ROUTES.DASHBOARD.BOARD}/${task.boardId}`}
											className='hover:bg-accent flex items-center justify-between gap-2 rounded-lg border p-2.5 text-sm transition-colors'
										>
											<div className='flex min-w-0 items-center gap-2'>
												{task.priority && (
													<PriorityWithTooltip
														priority={task.priority}
													/>
												)}
												<div className='flex min-w-0 flex-col'>
													<span className='truncate font-medium'>
														{task.name}
													</span>
													<span className='text-muted-foreground truncate text-xs'>
														{task.boardTitle}
													</span>
												</div>
											</div>
											<DueDateDisplay task={task} />
										</Link>
									))
								)}
							</CardContent>
						</Card>
					</div>
				</>
			)}
		</div>
	)
}
