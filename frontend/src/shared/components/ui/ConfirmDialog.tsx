import { VisuallyHidden } from 'radix-ui'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from './AlertDialog'

interface ConfirmDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: string
	description?: string
	confirmText?: string
	cancelText?: string
	disabled?: boolean
	onConfirm: () => void
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmText = 'Продолжить',
	cancelText = 'Отмена',
	disabled = false,
	onConfirm
}: ConfirmDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					{description ? (
						<AlertDialogDescription>
							{description}
						</AlertDialogDescription>
					) : (
						<VisuallyHidden.Root>
							<AlertDialogDescription>
								{title}
							</AlertDialogDescription>
						</VisuallyHidden.Root>
					)}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{cancelText}</AlertDialogCancel>
					<AlertDialogAction disabled={disabled} onClick={onConfirm}>
						{confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
