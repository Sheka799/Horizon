import { Metadata } from 'next'

import { Archive } from '@/features/board/components'

export const metadata: Metadata = {
	title: 'Архив доски'
}

type Props = {
	params: Promise<{ id: string }>
}

export default async function ArchivePage({ params }: Props) {
	const { id } = await params

	return <Archive boardId={id} />
}
