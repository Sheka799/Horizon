import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'
import {
	Bold,
	ChevronDown,
	Image as ImageIcon,
	Italic,
	Link as LinkIcon,
	Paperclip,
	Strikethrough,
	Unlink
} from 'lucide-react'

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/shared/components/ui'

interface ToolbarButtonProps {
	onClick: () => void
	isActive?: boolean
	label: string
	disabled?: boolean
	children: React.ReactNode
}

function ToolbarButton({
	onClick,
	isActive,
	label,
	disabled,
	children
}: ToolbarButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					type='button'
					variant={isActive ? 'secondary' : 'ghost'}
					size='icon'
					className='h-8 w-8'
					disabled={disabled}
					// onMouseDown + preventDefault вместо onClick —
					// предотвращает потерю фокуса редактора при клике на кнопку тулбара.
					// onClick срабатывает после того, как фокус уже ушёл с редактора,
					// onMouseDown — до этого момента, и preventDefault блокирует
					// переход фокуса на кнопку.
					onMouseDown={e => {
						e.preventDefault()
						onClick()
					}}
				>
					{children}
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>{label}</p>
			</TooltipContent>
		</Tooltip>
	)
}

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const
type HeadingLevel = (typeof HEADING_LEVELS)[number]

const LIST_TYPES = [
	{ value: 'bulletList', label: 'Маркированный список' },
	{ value: 'orderedList', label: 'Нумерованный список' }
] as const
type ListType = (typeof LIST_TYPES)[number]['value']

interface TaskDescriptionToolbarProps {
	editor: Editor
	onImageButtonClick: () => void
	onFileButtonClick: () => void
}

export function TaskDescriptionToolbar({
	editor,
	onImageButtonClick,
	onFileButtonClick
}: TaskDescriptionToolbarProps) {
	const editorState = useEditorState({
		editor,
		selector: ({ editor: e }) => ({
			isBold: e.isActive('bold'),
			isItalic: e.isActive('italic'),
			isStrike: e.isActive('strike'),
			isLink: e.isActive('link'),
			isBulletList: e.isActive('bulletList'),
			isOrderedList: e.isActive('orderedList'),
			activeHeadingLevel: HEADING_LEVELS.find(level =>
				e.isActive('heading', { level })
			) as HeadingLevel | undefined
		})
	})

	const headingLabel = editorState.activeHeadingLevel
		? `H${editorState.activeHeadingLevel}`
		: 'Текст'

	const activeListLabel = editorState.isBulletList
		? 'Маркированный'
		: editorState.isOrderedList
			? 'Нумерованный'
			: 'Список'

	const handleHeadingSelect = (level: HeadingLevel) => {
		if (editor.isActive('heading', { level })) {
			editor.chain().focus().setParagraph().run()
		} else {
			editor.chain().focus().toggleHeading({ level }).run()
		}
	}

	const handleListSelect = (type: ListType) => {
		if (type === 'bulletList') {
			editor.chain().focus().toggleBulletList().run()
		} else {
			editor.chain().focus().toggleOrderedList().run()
		}
	}

	const handleLink = () => {
		const previousUrl = editor.getAttributes('link').href as
			| string
			| undefined
		const url = window.prompt('Введите URL ссылки', previousUrl ?? '')

		if (url === null) return
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run()
			return
		}

		editor
			.chain()
			.focus()
			.extendMarkRange('link')
			.setLink({ href: url })
			.run()
	}

	return (
		<div className='bg-muted/40 flex flex-wrap items-center gap-1 rounded-t-md border border-b-0 p-1'>
			<ToolbarButton
				label='Жирный'
				isActive={editorState.isBold}
				onClick={() => editor.chain().focus().toggleBold().run()}
			>
				<Bold className='h-4 w-4' />
			</ToolbarButton>

			<ToolbarButton
				label='Курсив'
				isActive={editorState.isItalic}
				onClick={() => editor.chain().focus().toggleItalic().run()}
			>
				<Italic className='h-4 w-4' />
			</ToolbarButton>

			<ToolbarButton
				label='Зачёркнутый'
				isActive={editorState.isStrike}
				onClick={() => editor.chain().focus().toggleStrike().run()}
			>
				<Strikethrough className='h-4 w-4' />
			</ToolbarButton>

			<div className='bg-border mx-1 h-5 w-px' />

			{/* Заголовки — кнопка показывает текущий уровень заголовка под курсором */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						type='button'
						variant={
							editorState.activeHeadingLevel
								? 'secondary'
								: 'ghost'
						}
						size='sm'
						className='h-8 gap-1 px-2 text-xs font-medium'
					>
						{headingLabel}
						<ChevronDown className='h-3 w-3' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start'>
					<DropdownMenuItem
						onMouseDown={e => {
							e.preventDefault()
							editor.chain().focus().setParagraph().run()
						}}
						className={
							!editorState.activeHeadingLevel ? 'bg-accent' : ''
						}
					>
						Обычный текст
					</DropdownMenuItem>
					{HEADING_LEVELS.map(level => (
						<DropdownMenuItem
							key={level}
							onMouseDown={e => {
								e.preventDefault()
								handleHeadingSelect(level)
							}}
							className={
								editorState.activeHeadingLevel === level
									? 'bg-accent'
									: ''
							}
						>
							<span
								style={{
									fontSize: `${1.1 - level * 0.07}rem`,
									fontWeight: level <= 3 ? 'bold' : 'normal'
								}}
							>
								H{level} — Заголовок {level}
							</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			<div className='bg-border mx-1 h-5 w-px' />

			{/* Списки — кнопка показывает текущий тип списка под курсором */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						type='button'
						variant={
							editorState.isBulletList ||
							editorState.isOrderedList
								? 'secondary'
								: 'ghost'
						}
						size='sm'
						className='h-8 gap-1 px-2 text-xs font-medium'
					>
						{activeListLabel}
						<ChevronDown className='h-3 w-3' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start'>
					{LIST_TYPES.map(({ value, label }) => (
						<DropdownMenuItem
							key={value}
							onMouseDown={e => {
								e.preventDefault()
								handleListSelect(value)
							}}
							className={
								(value === 'bulletList' &&
									editorState.isBulletList) ||
								(value === 'orderedList' &&
									editorState.isOrderedList)
									? 'bg-accent'
									: ''
							}
						>
							{label}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			<div className='bg-border mx-1 h-5 w-px' />

			<ToolbarButton
				label='Ссылка'
				isActive={editorState.isLink}
				onClick={handleLink}
			>
				<LinkIcon className='h-4 w-4' />
			</ToolbarButton>

			<ToolbarButton
				label='Убрать ссылку'
				disabled={!editorState.isLink}
				onClick={() => editor.chain().focus().unsetLink().run()}
			>
				<Unlink className='h-4 w-4' />
			</ToolbarButton>

			<div className='bg-border mx-1 h-5 w-px' />

			<ToolbarButton
				label='Вставить изображение'
				onClick={onImageButtonClick}
			>
				<ImageIcon className='h-4 w-4' />
			</ToolbarButton>

			<ToolbarButton label='Прикрепить файл' onClick={onFileButtonClick}>
				<Paperclip className='h-4 w-4' />
			</ToolbarButton>
		</div>
	)
}
