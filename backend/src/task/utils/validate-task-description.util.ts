import { z } from 'zod'

interface TiptapMark {
	type: 'bold' | 'italic' | 'strike' | 'underline' | 'code' | 'link'
	attrs?: Record<string, unknown>
}

interface TiptapNode {
	type: string
	attrs?: Record<string, unknown>
	text?: string
	marks?: TiptapMark[]
	content?: TiptapNode[]
}

const textMarkSchema: z.ZodType<TiptapMark> = z.object({
	type: z.enum(['bold', 'italic', 'strike', 'underline', 'code', 'link']),
	attrs: z.record(z.string(), z.unknown()).optional()
})

const baseNodeSchema: z.ZodType<TiptapNode> = z.object({
	type: z.string(),
	attrs: z.record(z.string(), z.unknown()).optional(),
	text: z.string().optional(),
	marks: z.array(textMarkSchema).optional(),
	content: z.array(z.lazy(() => nodeSchema)).optional()
})

const imageNodeSchema: z.ZodType<TiptapNode> = baseNodeSchema.and(
	z.object({
		type: z.literal('image'),
		attrs: z.object({
			src: z.string().url(),
			alt: z.string().nullable().optional(),
			title: z.string().nullable().optional(),
			attachmentId: z.string().optional()
		})
	})
)

const fileNodeSchema: z.ZodType<TiptapNode> = baseNodeSchema.and(
	z.object({
		type: z.literal('file'),
		attrs: z.object({
			url: z.string().url(),
			name: z.string(),
			mimetype: z.string(),
			size: z.number(),
			attachmentId: z.string().optional()
		})
	})
)

export const nodeSchema: z.ZodType<TiptapNode> = z.lazy(() =>
	z.union([imageNodeSchema, fileNodeSchema, baseNodeSchema])
)

export const tiptapDocumentSchema = z.object({
	type: z.literal('doc'),
	content: z.array(nodeSchema).optional()
})

function collectMediaUrls(node: TiptapNode, urls: string[] = []): string[] {
	if (node.type === 'image' && typeof node.attrs?.src === 'string') {
		urls.push(node.attrs.src)
	}
	if (node.type === 'file' && typeof node.attrs?.url === 'string') {
		urls.push(node.attrs.url)
	}
	if (Array.isArray(node.content)) {
		for (const child of node.content) {
			collectMediaUrls(child, urls)
		}
	}
	return urls
}

function collectMediaUrlsFromNodes(nodes: TiptapNode[]): string[] {
	const urls: string[] = []
	for (const node of nodes) {
		collectMediaUrls(node, urls)
	}
	return urls
}

export function validateTaskDescription(value: unknown, allowedOrigin: string) {
	const result = tiptapDocumentSchema.safeParse(value)

	if (!result.success) {
		throw new Error(
			`Некорректная структура description: ${result.error.message}`
		)
	}

	const urls = collectMediaUrlsFromNodes(result.data.content ?? [])
	const disallowed = urls.filter(url => !url.startsWith(allowedOrigin))

	if (disallowed.length > 0) {
		throw new Error(
			`Найдены ссылки на медиа за пределами разрешённого хранилища: ${disallowed.join(', ')}`
		)
	}

	return result.data
}
