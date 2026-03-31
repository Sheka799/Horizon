'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { cn } from '@/shared/utils'

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return (
			<div className='flex items-center gap-1 rounded-lg border p-1'>
				<div className='bg-muted h-8 w-16 animate-pulse rounded-md' />
				<div className='bg-muted h-8 w-16 animate-pulse rounded-md' />
			</div>
		)
	}

	return (
		<div className='flex items-center gap-1 rounded-lg border p-1'>
			<button
				onClick={() => setTheme('light')}
				className={cn(
					'cursor-pointer rounded-md px-3 py-1.5 text-sm transition-colors',
					theme === 'light'
						? 'border-primary text-primary border'
						: 'text-muted-foreground hover:text-foreground'
				)}
			>
				Светлая
			</button>
			<button
				onClick={() => setTheme('dark')}
				className={cn(
					'cursor-pointer rounded-md px-3 py-1.5 text-sm transition-colors',
					theme === 'dark'
						? 'border-primary text-primary border'
						: 'text-muted-foreground hover:text-foreground'
				)}
			>
				Темная
			</button>
		</div>
	)
}
