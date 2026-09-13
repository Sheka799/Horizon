import type { Metadata } from 'next'
import Link from 'next/link'

import { ROUTES } from '@/shared/config'

export const metadata: Metadata = {
	title: 'Политика обработки персональных данных',
	description:
		'Политика обработки персональных данных пользователей сервиса Horizon'
}

export default function PrivacyPolicyPage() {
	return (
		<div className='bg-background min-h-screen'>
			<header className='flex items-center justify-between px-6 py-5 sm:px-10'>
				<Link
					href={ROUTES.HOME}
					className='text-lg font-bold tracking-tight'
				>
					Horizon
				</Link>
				<Link
					href={ROUTES.AUTH.LOGIN}
					className='text-sm font-semibold'
				>
					Войти <span aria-hidden='true'>&rarr;</span>
				</Link>
			</header>

			<div className='mx-auto max-w-3xl px-6 pb-24 sm:px-10'>
				<h1 className='text-3xl font-semibold tracking-tight text-balance sm:text-4xl'>
					Политика обработки персональных данных
				</h1>
				<p className='text-muted-foreground mt-2 mb-10 text-sm'>
					Действует с 13.09.2026
				</p>

				<div className='text-foreground space-y-8 text-base/7'>
					<section>
						<h2 className='mb-2 text-xl font-semibold'>
							1. Общие положения
						</h2>
						<p>
							Настоящая Политика определяет порядок обработки
							персональных данных пользователей веб-сервиса
							Horizon (далее — «Сервис»), расположенного по адресу
							https://horizon.web-evgeny.ru, и составлена в
							соответствии с Федеральным законом от 27.07.2006
							№&nbsp;152-ФЗ «О персональных данных».
						</p>
						<p className='mt-2'>
							Оператор персональных данных: Криволапов Евгений
							Игоревич, физическое лицо, контактный email:{' '}
							horizon@web-evgeny.ru.
						</p>
					</section>

					<section>
						<h2 className='mb-2 text-xl font-semibold'>
							2. Какие данные мы собираем
						</h2>
						<p>
							При использовании Сервиса мы обрабатываем следующие
							данные:
						</p>
						<ul className='mt-2 list-disc space-y-1 pl-6'>
							<li>email, указанный при регистрации;</li>
							<li>
								пароль — хранится не в открытом виде, а в виде
								необратимого криптографического хэша (argon2),
								сам пароль нам не доступен;
							</li>
							<li>имя, указанное в настройках профиля;</li>
							<li>
								фотография профиля (аватар) — только если вы
								вошли через Яндекс, в этом случае
								аватар подтягивается от провайдера;
							</li>
							<li>
								данные об OAuth-аккаунте (Яндекс) — при
								входе через соответствующий сервис;
							</li>
							<li>
								содержимое созданных вами досок, колонок и
								задач, включая вложенные файлы и изображения;
							</li>
							<li>
								технические данные: IP-адрес, тип браузера и
								устройства, файлы cookie, данные о переходах и
								действиях на страницах сайта.
							</li>
						</ul>
					</section>

					<section>
						<h2 className='mb-2 text-xl font-semibold'>
							3. Cookie и аналитика
						</h2>
						<p>
							Сервис использует технически необходимые файлы
							cookie:{' '}
							<code className='bg-muted rounded px-1 py-0.5 text-sm'>
								session_horizon
							</code>{' '}
							— для авторизации (флаг HttpOnly, недоступна для
							чтения скриптами страницы), и{' '}
							<code className='bg-muted rounded px-1 py-0.5 text-sm'>
								XSRF-TOKEN
							</code>{' '}
							— для защиты от межсайтовой подделки запросов
							(CSRF).
						</p>
						<p className='mt-2'>
							Для анализа посещаемости используется{' '}
							<strong>Яндекс.Метрика</strong> — сервис
							веб-аналитики ООО «ЯНДЕКС», в том числе с включённым
							Вебвизором, который может записывать действия на
							странице (клики, прокрутку) для анализа удобства
							использования интерфейса. Метрика собирает
							обезличенные технические данные о посещении сайта
							(IP-адрес, тип устройства, клики, переходы по
							ссылкам). Обработка этих данных Яндексом
							регулируется отдельной{' '}
							<a
								href='https://yandex.ru/legal/confidential/'
								target='_blank'
								rel='noopener noreferrer'
								className='text-primary underline underline-offset-2'
							>
								политикой конфиденциальности Яндекса
							</a>
							.
						</p>
					</section>

					<section>
						<h2 className='mb-2 text-xl font-semibold'>
							4. Цели обработки
						</h2>
						<ul className='list-disc space-y-1 pl-6'>
							<li>регистрация и авторизация в Сервисе;</li>
							<li>
								предоставление функционала Сервиса (создание,
								хранение и редактирование досок, колонок и
								задач);
							</li>
							<li>хранение и отображение вложений к задачам;</li>
							<li>
								улучшение работы Сервиса на основе статистики
								использования;
							</li>
							<li>
								связь с пользователем по вопросам работы Сервиса
								(при необходимости).
							</li>
						</ul>
					</section>

					<section>
						<h2 className='mb-2 text-xl font-semibold'>
							5. Хранение и защита данных
						</h2>
						<p>
							Данные хранятся на серверах, расположенных на
							территории Российской Федерации. Вложения к задачам
							хранятся в объектном хранилище S3-совместимого
							провайдера. Пароли хранятся в виде хэша (argon2),
							доступ к базе данных ограничен, соединение с сайтом
							защищено протоколом HTTPS.
						</p>
					</section>

					<section>
						<h2 className='mb-2 text-xl font-semibold'>
							6. Передача третьим лицам
						</h2>
						<p>
							Мы не продаём и не передаём ваши персональные данные
							третьим лицам, за исключением:
						</p>
						<ul className='mt-2 list-disc space-y-1 pl-6'>
							<li>
								сервиса аналитики Яндекс.Метрика (обезличенные
								технические данные о посещениях);
							</li>
							<li>
								провайдера объектного хранилища — для хранения
								файлов, прикреплённых к задачам;
							</li>
							<li>
								Яндекс — если вы используете вход через
								эти сервисы;
							</li>
							<li>
								случаев, прямо предусмотренных законодательством
								РФ.
							</li>
						</ul>
					</section>

					<section>
						<h2 className='mb-2 text-xl font-semibold'>
							7. Ваши права
						</h2>
						<p>Вы вправе в любой момент:</p>
						<ul className='mt-2 list-disc space-y-1 pl-6'>
							<li>
								запросить информацию о том, какие ваши данные
								обрабатываются;
							</li>
							<li>
								потребовать исправления неточных данных (через
								настройки профиля);
							</li>
							<li>
								отозвать согласие на обработку персональных
								данных и потребовать удаления аккаунта и всех
								связанных данных.
							</li>
						</ul>
						<p className='mt-2'>
							Для отзыва согласия и удаления аккаунта напишите нам
							на horizon@web-evgeny.ru.
						</p>
					</section>

					<section>
						<h2 className='mb-2 text-xl font-semibold'>
							8. Изменения политики
						</h2>
						<p>
							Мы можем обновлять эту Политику. Актуальная версия
							всегда доступна по этому адресу. Дата вступления в
							силу указана в начале документа.
						</p>
					</section>
				</div>
			</div>
		</div>
	)
}
