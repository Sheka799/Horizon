import { Settings } from '@/features/dashboard/components'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Настройки'
}

export default function SettingsPage() {
	return <Settings />
}
