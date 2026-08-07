import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import { UploadingFileView } from './UploadingFileView'

// Временная нода, которая показывается в редакторе пока файл загружается.
// После завершения загрузки заменяется на реальную ноду (image или file).
// id нужен, чтобы найти конкретный placeholder среди других таких же
// (если юзер одновременно загружает несколько файлов).
export const UploadingFile = Node.create({
	name: 'uploadingFile',
	group: 'block',
	atom: true,
	selectable: false, // нельзя выделить — только читать
	draggable: false,

	addAttributes() {
		return {
			id: { default: null }, // уникальный id этой загрузки
			name: { default: null }, // имя файла
			progress: { default: 0 }, // 0-100
			isImage: { default: false } // картинка или файл-документ
		}
	},

	parseHTML() {
		return [{ tag: 'div[data-type="uploading-file"]' }]
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			mergeAttributes(HTMLAttributes, { 'data-type': 'uploading-file' })
		]
	},

	addNodeView() {
		return ReactNodeViewRenderer(UploadingFileView)
	}
})
