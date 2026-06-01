import { Metadata } from 'next'

import { Settings } from '@/features/board/components'

export const metadata: Metadata = {
	title: 'Настройки'
}

export default function SettingsPage() {
	return <Settings />
}
