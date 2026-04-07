'use client'

import {
	CircleUserRoundIcon,
	EllipsisVerticalIcon,
	LogOutIcon
} from 'lucide-react'

import { useLogoutMutation, useProfile } from '@/features/user/hooks'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenuLinkItem,
	Skeleton
} from '@/shared/components/ui'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/shared/components/ui'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from '@/shared/components/ui'

import { ROUTES } from '../config'

function NavUserSkeleton() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size='lg' disabled>
					<Skeleton className='h-8 w-8 rounded-lg' />
					<div className='grid flex-1 gap-1.5'>
						<Skeleton className='h-3.5 w-24' />
						<Skeleton className='h-3 w-32' />
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

export function NavUser() {
	const { isMobile } = useSidebar()
	const { logout, isLoadingLogout } = useLogoutMutation()
	const { user, isLoading } = useProfile()

	if (isLoading) return <NavUserSkeleton />
	if (!user) return null

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
						>
							<Avatar className='h-8 w-8 rounded-lg grayscale'>
								<AvatarImage
									src={user.picture}
									alt={user.displayName}
								/>
								<AvatarFallback className='rounded-lg'>
									{user.displayName.slice(0, 1).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-medium'>
									{user.displayName}
								</span>
								<span className='text-muted-foreground truncate text-xs'>
									{user.email}
								</span>
							</div>
							<EllipsisVerticalIcon className='ml-auto size-4' />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
						side={isMobile ? 'bottom' : 'right'}
						align='end'
						sideOffset={4}
					>
						<DropdownMenuLabel className='p-0 font-normal'>
							<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
								<Avatar className='h-8 w-8 rounded-lg'>
									<AvatarImage
										src={user.picture}
										alt={user.displayName}
									/>
									<AvatarFallback className='rounded-lg'>
										{user.displayName
											.slice(0, 1)
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-medium'>
										{user.displayName}
									</span>
									<span className='text-muted-foreground truncate text-xs'>
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuLinkItem
								href={ROUTES.DASHBOARD.PROFILE}
							>
								<CircleUserRoundIcon />
								Настройки профиля
							</DropdownMenuLinkItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							disabled={isLoadingLogout}
							onClick={() => logout()}
						>
							<LogOutIcon />
							Выйти
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
