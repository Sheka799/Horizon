import type { Metadata } from 'next'
import Link from 'next/link'
import {
	Archive,
	Calendar1,
	Columns3,
	Paperclip,
	ShieldCheck,
	Text
} from 'lucide-react'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	ToggleTheme,
	buttonVariants
} from '@/shared/components/ui'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/utils'

const SITE_URL = 'https://horizon.web-evgeny.ru'
const SITE_NAME = 'Horizon — Система управления задачами и проектами'
const SITE_DESCRIPTION =
	'Horizon — канбан-доски с drag-n-drop, подробными описаниями задач, вложениями и архивом.'

export const metadata: Metadata = {
	title: {
		absolute: SITE_NAME
	},
	description: SITE_DESCRIPTION,
	keywords: [
		'Horizon',
		'канбан-доски',
		'канбан',
		'управление задачами',
		'таск-менеджер',
		'kanban board',
		'task management',
		'drag-n-drop задачи'
	],
	alternates: {
		canonical: SITE_URL
	},
	openGraph: {
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		url: SITE_URL,
		siteName: 'Horizon',
		locale: 'ru_RU',
		type: 'website'
	}
}

const FEATURES = [
	{
		icon: Columns3,
		title: 'Канбан-доски',
		description:
			'Перетаскивайте задачи между колонками — заводите столько досок и колонок, сколько нужно под ваш процесс.'
	},
	{
		icon: Text,
		title: 'Подробные описания',
		description:
			'Форматированный текст с заголовками и списками прямо в карточке задачи — не нужно вести ТЗ где-то ещё.'
	},
	{
		icon: Paperclip,
		title: 'Файлы и изображения',
		description:
			'Прикладывайте скриншоты, документы и картинки к задаче — всё нужное для работы в одном месте.'
	},
	{
		icon: Calendar1,
		title: 'Приоритеты и дедлайны',
		description:
			'Отмечайте важность задач и сроки — ничего не потеряется в потоке дел.'
	},
	{
		icon: Archive,
		title: 'Архив задач',
		description:
			'Закрытые задачи не исчезают — всегда можно вернуться и посмотреть историю по доске.'
	},
	{
		icon: ShieldCheck,
		title: 'Безопасный вход',
		description:
			'Email и пароль, вход через Яндекс, двухфакторная аутентификация — как удобнее вам.'
	}
]

const JSON_LD = {
	'@context': 'https://schema.org',
	'@type': 'WebApplication',
	name: 'Horizon',
	url: SITE_URL,
	description: SITE_DESCRIPTION,
	applicationCategory: 'ProductivityApplication',
	operatingSystem: 'Web',
	inLanguage: 'ru',
	offers: {
		'@type': 'Offer',
		price: '0',
		priceCurrency: 'RUB'
	}
}

export default function Home() {
	return (
		<div className='flex min-h-screen flex-col'>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
			/>
			<header className='flex items-center justify-between px-6 py-5 sm:px-10'>
				<span className='text-lg font-bold tracking-tight'>Horizon</span>
				<div className='flex items-center gap-2'>
					<ToggleTheme />
					<Link
						href={ROUTES.AUTH.LOGIN}
						className={buttonVariants({ variant: 'ghost' })}
					>
						Войти
					</Link>
					<Link
						href={ROUTES.AUTH.REGISTER}
						className={buttonVariants()}
					>
						Регистрация
					</Link>
				</div>
			</header>

			<main className='flex-1'>
				<section className='mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-20 text-center sm:py-28'>
					<span className='bg-muted text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium'>
						Канбан-доски для команд и личных проектов
					</span>
					<h1 className='text-4xl font-bold tracking-tight text-balance sm:text-5xl'>
						Система управления задачами и проектами
					</h1>
					<p className='text-muted-foreground max-w-xl text-lg text-balance'>
						Доски, дедлайны, вложения и архив в одном месте —
						Horizon помогает не терять контекст ни по личным
						делам, ни по командным проектам.
					</p>
					<div className='flex flex-wrap items-center justify-center gap-3'>
						<Link
							href={ROUTES.AUTH.REGISTER}
							className={buttonVariants({ size: 'lg' })}
						>
							Начать бесплатно
						</Link>
						<Link
							href={ROUTES.AUTH.LOGIN}
							className={buttonVariants({ variant: 'outline', size: 'lg' })}
						>
							Войти в аккаунт
						</Link>
					</div>
				</section>

				<section className='mx-auto max-w-5xl px-6 py-16'>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{FEATURES.map(feature => (
							<Card key={feature.title}>
								<CardHeader>
									<feature.icon className='text-muted-foreground mb-1 h-6 w-6' />
									<CardTitle className='text-base'>
										{feature.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>
										{feature.description}
									</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section className='border-t px-6 py-16 text-center'>
					<h2 className='text-2xl font-bold tracking-tight'>
						Готовы навести порядок в задачах?
					</h2>
					<p className='text-muted-foreground mt-2'>
						Регистрация занимает меньше минуты.
					</p>
					<Link
						href={ROUTES.AUTH.REGISTER}
						className={cn(buttonVariants({ size: 'lg' }), 'mt-6')}
					>
						Создать аккаунт
					</Link>
				</section>
			</main>

			<footer className='text-muted-foreground border-t px-6 py-6 text-center text-sm'>
				© {new Date().getFullYear()} Horizon
			</footer>
		</div>
	)
}
