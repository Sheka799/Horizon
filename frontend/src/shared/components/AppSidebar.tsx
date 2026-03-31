'use client'

import {
	CommandIcon,
	Grid2x2,
	LayoutDashboardIcon,
	SettingsIcon
} from 'lucide-react'
import * as React from 'react'

import { NavMain } from '@/shared/components/NavMain'
import { NavUser } from '@/shared/components/NavUser'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/shared/components/ui'

import { useProfile } from '../hooks'

import { Loader } from './ui'
import { ROUTES } from '../config'

const data = {
	navMain: [
		{
			title: 'Дашборд',
			url: ROUTES.DASHBOARD.ROOT,
			icon: <LayoutDashboardIcon />
		},
		{
			title: 'Доски задач',
			url: ROUTES.DASHBOARD.BOARDS,
			icon: <Grid2x2 />
		},
		{
			title: 'Настройки',
			url: ROUTES.DASHBOARD.SETTINGS,
			icon: <SettingsIcon />
		}
	]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { isLoading } = useProfile()

	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className='data-[slot=sidebar-menu-button]:p-1.5!'
						>
							<div>
								<CommandIcon className='size-5!' />
								<span className='text-base font-semibold'>
									Horizon
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				{isLoading ? <Loader /> : <NavUser />}
			</SidebarFooter>
		</Sidebar>
	)
}
