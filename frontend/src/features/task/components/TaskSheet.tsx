'use client'

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from '@/shared/components/ui'

import { TaskDetails } from './TaskDetails'

interface TaskSheetProps {
	taskId: string
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function TaskSheet({ taskId, open, onOpenChange }: TaskSheetProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side='right'
				className='w-full !max-w-[250px] md:!max-w-[450px] overflow-y-auto'
			>
				<SheetHeader>
					<SheetTitle>Детали задачи</SheetTitle>
				</SheetHeader>
				<div className='px-6 pb-6'>
					<TaskDetails taskId={taskId} />
				</div>
			</SheetContent>
		</Sheet>
	)
}
