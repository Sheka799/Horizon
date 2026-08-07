import { type NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { File, Image as ImageIcon } from 'lucide-react'

export function UploadingFileView({ node }: NodeViewProps) {
	const { name, progress, isImage } = node.attrs as {
		name: string
		progress: number
		isImage: boolean
	}

	const Icon = isImage ? ImageIcon : File

	return (
		<NodeViewWrapper>
			<div className='bg-card my-2 max-w-sm rounded-lg border p-3 shadow-xs'>
				<div className='mb-2 flex items-center gap-3'>
					<Icon className='text-muted-foreground h-5 w-5 shrink-0' />
					<p className='text-foreground min-w-0 truncate text-sm font-medium'>
						{name}
					</p>
					<span className='text-muted-foreground ml-auto shrink-0 text-xs'>
						{progress}%
					</span>
				</div>

				{/* Прогресс-бар */}
				<div className='bg-muted h-1.5 w-full overflow-hidden rounded-full'>
					<div
						className='bg-primary h-full rounded-full transition-all duration-200 ease-out'
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
		</NodeViewWrapper>
	)
}
