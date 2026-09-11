import Link from 'next/link'

import { ToggleTheme } from '@/shared/components/ui'
import { ROUTES } from '@/shared/config'

export default function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='flex min-h-screen flex-col'>
			<header className='flex items-center justify-between px-6 py-5 sm:px-10'>
				<Link
					href={ROUTES.HOME}
					className='text-lg font-bold tracking-tight'
				>
					Horizon
				</Link>
				<ToggleTheme />
			</header>
			<main className='flex flex-1 items-center justify-center px-4 pb-10'>
				{children}
			</main>
		</div>
	)
}
