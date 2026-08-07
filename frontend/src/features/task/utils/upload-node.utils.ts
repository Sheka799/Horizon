import type { Editor, JSONContent } from '@tiptap/react'

// Вставляет placeholder-ноду в позицию курсора и возвращает её id
export function insertUploadingNode(
	editor: Editor,
	id: string,
	name: string,
	isImage: boolean
) {
	editor
		.chain()
		.focus()
		.insertContent({
			type: 'uploadingFile',
			attrs: { id, name, progress: 0, isImage }
		})
		.run()
}

// Обновляет прогресс конкретной uploading-ноды по её id.
// Ищем ноду в документе, находим её позицию и обновляем атрибут.
export function updateUploadingProgress(
	editor: Editor,
	id: string,
	progress: number
) {
	const { doc, tr } = editor.state
	let found = false

	doc.descendants((node, pos) => {
		if (found) return false
		if (node.type.name === 'uploadingFile' && node.attrs.id === id) {
			editor.view.dispatch(
				tr.setNodeMarkup(pos, undefined, {
					...node.attrs,
					progress
				})
			)
			found = true
			return false
		}
	})
}

// Заменяет uploading-ноду на реальную ноду (image или file) по завершении загрузки
export function replaceUploadingNode(
	editor: Editor,
	id: string,
	finalNode: JSONContent
) {
	const { doc, tr } = editor.state
	let found = false

	doc.descendants((node, pos) => {
		if (found) return false
		if (node.type.name === 'uploadingFile' && node.attrs.id === id) {
			tr.replaceWith(
				pos,
				pos + node.nodeSize,
				editor.schema.nodeFromJSON(finalNode)
			)
			editor.view.dispatch(tr)
			found = true
			return false
		}
	})
}

// Удаляет uploading-ноду (при ошибке загрузки)
export function removeUploadingNode(editor: Editor, id: string) {
	const { doc, tr } = editor.state
	let found = false

	doc.descendants((node, pos) => {
		if (found) return false
		if (node.type.name === 'uploadingFile' && node.attrs.id === id) {
			tr.delete(pos, pos + node.nodeSize)
			editor.view.dispatch(tr)
			found = true
			return false
		}
	})
}
