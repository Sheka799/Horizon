import { type NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { Download, File, FileText } from 'lucide-react'

import { isSafeUrl } from '@/shared/utils'

function formatBytes(bytes: number) {
	if (bytes < 1024) return `${bytes} Б`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
	return `${(bytes / 1024 / 1024).toFixed(1)} МБ`
}

export function FileAttachmentView({ node }: NodeViewProps) {
	const { url, name, mimetype, size } = node.attrs

	const Icon = mimetype === 'application/pdf' ? FileText : File
	const safeUrl = isSafeUrl(url)

	return (
		<NodeViewWrapper>
			<div className='bg-card my-2 flex max-w-sm items-center justify-between gap-3 rounded-lg border p-3 shadow-xs'>
				<div className='flex min-w-0 items-center gap-3'>
					<Icon className='text-muted-foreground h-7 w-7 shrink-0' />
					<div className='min-w-0'>
						<p className='truncate text-sm font-medium'>{name}</p>
						<p className='text-muted-foreground text-xs'>
							{formatBytes(size)}
						</p>
					</div>
				</div>
				{safeUrl ? (
					<a
						href={url}
						target='_blank'
						rel='noopener noreferrer'
						download={name}
						className='text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 rounded-md p-2'
					>
						<Download className='h-4 w-4' />
					</a>
				) : (
					<span
						title='Небезопасная ссылка заблокирована'
						className='text-muted-foreground/40 shrink-0 rounded-md p-2'
					>
						<Download className='h-4 w-4' />
					</span>
				)}
			</div>
		</NodeViewWrapper>
	)
}
