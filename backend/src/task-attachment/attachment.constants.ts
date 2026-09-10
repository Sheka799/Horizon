export const ALLOWED_IMAGE_MIME_TYPES = [
	'image/png',
	'image/jpeg',
	'image/webp',
	'image/gif',
	'image/avif'
] as const

export const ALLOWED_DOCUMENT_MIME_TYPES = [
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'text/plain',
	'application/zip'
] as const

export const ALLOWED_MIME_TYPES: readonly string[] = [
	...ALLOWED_IMAGE_MIME_TYPES,
	...ALLOWED_DOCUMENT_MIME_TYPES
]

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024 // 15 МБ

export function isImageMimeType(mimetype: string): boolean {
	return (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(mimetype)
}