import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import { FileAttachmentView } from './FileAttachmentView'

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		fileAttachment: {
			insertFileAttachment: (attrs: {
				url: string
				name: string
				mimetype: string
				size: number
			}) => ReturnType
		}
	}
}

export const FileAttachment = Node.create({
	name: 'file',
	group: 'block',
	atom: true,

	addAttributes() {
		return {
			url: { default: null },
			name: { default: null },
			mimetype: { default: null },
			size: { default: 0 }
		}
	},

	parseHTML() {
		return [{ tag: 'div[data-type="file-attachment"]' }]
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			mergeAttributes(HTMLAttributes, { 'data-type': 'file-attachment' })
		]
	},

	addNodeView() {
		return ReactNodeViewRenderer(FileAttachmentView)
	},

	addCommands() {
		return {
			insertFileAttachment:
				attrs =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
						attrs
					})
				}
		}
	}
})
