import { Board } from '@/features/dashboard/components'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Доска'
}

type Props = {
    params: Promise<{id: string}>
}

export default async function BoardPage({params}: Props) {
	const id = (await params).id

	return <Board id={id} />
}
