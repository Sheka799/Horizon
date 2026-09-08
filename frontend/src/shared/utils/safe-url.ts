const ALLOWED_PROTOCOLS = new Set(['http:', 'https:'])

export function isSafeUrl(url: string): boolean {
	try {
		return ALLOWED_PROTOCOLS.has(new URL(url).protocol)
	} catch {
		return false
	}
}
