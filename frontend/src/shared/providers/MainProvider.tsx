'use client'

import { type PropsWithChildren } from 'react'

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
				</TooltipProvider>
			</ThemeProvider>
		</TanstackQueryProvider>
	)
}
