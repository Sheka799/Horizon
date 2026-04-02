'use client'

import { Loader } from '@/shared/components/ui'

import { useBoard } from '../hooks'

export function Board({ id }: { id: string }) {
	const { board, isLoading } = useBoard(id)
    
	return <>{isLoading ? <Loader /> : <div>{board?.title}</div>}</>
}
