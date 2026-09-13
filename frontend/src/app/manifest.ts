import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Horizon — Система управления задачами и проектами',
		short_name: 'Horizon',
		description:
			'Канбан-доски с drag-n-drop, подробными описаниями задач, вложениями и архивом.',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#171717',
		icons: [
			{
				src: '/favicon/icon.svg',
				sizes: 'any',
				type: 'image/svg+xml'
			},
			{
				src: '/favicon/web-app-manifest-192x192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'any'
			},
			{
				src: '/favicon/web-app-manifest-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any'
			}
		]
	}
}
