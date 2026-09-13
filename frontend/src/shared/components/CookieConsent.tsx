'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/shared/components/ui'
import { ROUTES } from '@/shared/config'

const STORAGE_KEY = 'cookieConsent'

export function CookieConsent() {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		try {
			if (!localStorage.getItem(STORAGE_KEY)) {
				setVisible(true)
			}
		} catch {}
	}, [])

	const accept = () => {
		try {
			localStorage.setItem(STORAGE_KEY, 'accepted')
		} catch {}
		setVisible(false)
	}

	if (!visible) return null

	return (
		<div className='fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-4 sm:left-auto sm:max-w-md'>
			<div className='bg-card flex flex-col items-center gap-3 rounded-2xl border p-4 shadow-xl sm:flex-row'>
				<p className='text-muted-foreground text-sm'>
					Мы используем файлы cookie и сервисы аналитики, чтобы
					сделать сайт удобнее. Подробнее — в{' '}
					<Link
						href={ROUTES.PRIVACY_POLICY}
						className='text-primary underline underline-offset-2'
					>
						политике
					</Link>
				</p>
				<Button onClick={accept} className='w-full shrink-0 sm:w-auto'>
					Принять
				</Button>
			</div>
		</div>
	)
}
