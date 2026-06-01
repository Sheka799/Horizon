import { Metadata } from 'next'

import { Boards } from '@/features/board/components'

export const metadata: Metadata = {
	title: 'Доски задач',
	description:
		'Управление досками задач для организации работы и отслеживания прогресса'
}

export default function BoardsPage() {
	return <Boards />
}
