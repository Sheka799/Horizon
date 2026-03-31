import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import '../shared/styles/globals.css'
import { MainProvider } from '@/shared/providers'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: {
		absolute: 'Авторизация',
		template: '%s | Horizon'
	},
	description: 'Страница авторизации для доступа к личному кабинету'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='ru' suppressHydrationWarning 
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className='flex min-h-full flex-col'>
				<MainProvider>
					<div className='relative flex min-h-screen flex-col'>
						{children}
					</div>
				</MainProvider>
			</body>
		</html>
	)
}
