import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { MainProvider } from '@/shared/providers'

import '../shared/styles/globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

export const metadata: Metadata = {
	metadataBase: new URL('https://horizon.web-evgeny.ru'),
	title: {
		absolute: 'Авторизация',
		template: '%s | Horizon'
	},
	description: 'Страница авторизации для доступа к личному кабинету',
	icons: {
		icon: [
			{ url: '/favicon/favicon.ico', sizes: 'any' },
			{ url: '/favicon/icon.png', type: 'image/png', sizes: '32x32' },
			{ url: '/favicon/icon.svg', type: 'image/svg+xml' },
			{
				url: '/favicon/web-app-manifest-192x192.png',
				type: 'image/png',
				sizes: '192x192'
			},
			{
				url: '/favicon/web-app-manifest-512x512.png',
				type: 'image/png',
				sizes: '512x512'
			}
		],
		apple: [
			{
				url: '/favicon/apple-icon.png',
				type: 'image/png',
				sizes: '180x180'
			}
		]
	}
}

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
	]
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='ru'
			suppressHydrationWarning
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
