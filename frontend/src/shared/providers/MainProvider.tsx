'use client'

import { type PropsWithChildren } from 'react'

import { CookieConsent, YandexMetrika } from '@/shared/components'

import { TanstackQueryProvider } from './TanstackQueryProvider'
import { ThemeProvider } from './ThemeProvider'
import { ToastProvider } from './ToastProvider'
import { TooltipProvider } from './TooltipProvider'

export function MainProvider({ children }: PropsWithChildren<unknown>) {
	return (
		<TanstackQueryProvider>
			<ThemeProvider
				attribute='class'
				defaultTheme='light'
				disableTransitionOnChange
			>
				<TooltipProvider>
					<ToastProvider />
					{children}
					<YandexMetrika />
					<CookieConsent />
				</TooltipProvider>
			</ThemeProvider>
		</TanstackQueryProvider>
	)
}
