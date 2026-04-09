'use client'

import { usePathname } from 'next/navigation'

import { useBoardQuery } from '@/features/dashboard/hooks'

import { ROUTES } from '../config'

import { Separator, SidebarTrigger, Skeleton } from './ui'

const TITLES: Record<string, string> = {
	[ROUTES.DASHBOARD.ROOT]: 'Дашборд',
	[ROUTES.DASHBOARD.BOARDS]: 'Доски задач',
	[ROUTES.DASHBOARD.SETTINGS]: 'Настройки',
	[ROUTES.DASHBOARD.PROFILE]: 'Настройки профиля'
}

export function SiteHeader() {
	const pathname = usePathname()

	const boardId = pathname.startsWith(ROUTES.DASHBOARD.BOARD + '/')
		? pathname.split('/').at(-1)
		: undefined

	const { board, isLoading } = useBoardQuery(boardId ?? '')

	const title = boardId ? board?.title : (TITLES[pathname] ?? 'Дашборд')

	return (
		<header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
			<div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
				<SidebarTrigger className='-ml-1' />
				<Separator
					orientation='vertical'
					className='mx-2 data-[orientation=vertical]:h-4'
				/>
				{boardId && isLoading ? (
					<Skeleton className='h-5 w-32' />
				) : (
					<h1 className='text-base font-medium'>{title}</h1>
				)}
			</div>
		</header>
	)
}
