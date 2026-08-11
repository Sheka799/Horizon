'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SmartCaptcha } from '@yandex/smart-captcha'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input
} from '@/shared/components/ui'
import { ROUTES } from '@/shared/config'

import { useLoginMutation } from '../hooks'
import { LoginSchema, TypeLoginSchema } from '../schemes'

import { AuthWrapper } from './AuthWrapper'

export function LoginForm() {
	const [captchaToken, setCaptchaToken] = useState<string | null>(null)
	const [captchaKey, setCaptchaKey] = useState(0)
	const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)

	const form = useForm<TypeLoginSchema>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
			code: ''
		}
	})

	const { login, IsLoadingLogin } = useLoginMutation(setIsShowTwoFactor)

	const resetCaptcha = () => {
		setCaptchaToken(null)
		setCaptchaKey(prev => prev + 1)
	}

	const onSubmit = (values: TypeLoginSchema) => {
		if (!captchaToken) {
			toast.error('Пожалуйста, подтвердите, что вы не робот')
			return
		}

		const tokenToSend = captchaToken
		resetCaptcha()

		login({ values, recaptcha: tokenToSend })
	}

	return (
		<AuthWrapper
			heading='Вход'
			description='Чтобы войти на сайт введите ваш email и пароль'
			backButtonLabel='Нет аккаунта? Зарегистрироваться'
			backButtonHref={ROUTES.AUTH.REGISTER}
			isShowSocials
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid gap-2 space-y-2'
				>
					{isShowTwoFactor && (
						<FormField
							control={form.control}
							name='code'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Код двухфакторной аутентификации
									</FormLabel>
									<FormControl>
										<Input
											disabled={IsLoadingLogin}
											placeholder='Введите код'
											type='text'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					{!isShowTwoFactor && (
						<>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder='Введите ваш email'
												type='email'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<div className='flex items-center justify-between'>
											<FormLabel>Пароль</FormLabel>
											<Link
												href={
													ROUTES.AUTH.RESET_PASSWORD
												}
												className='ml-auto inline-block text-sm underline'
											>
												Забыли пароль?
											</Link>
										</div>
										<FormControl>
											<Input
												placeholder='********'
												type='password'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					<div className='flex justify-center'>
						<SmartCaptcha
							key={captchaKey}
							sitekey={
								process.env
									.NEXT_PUBLIC_YANDEX_SMART_CAPTCHA_CLIENT_KEY as string
							}
							onSuccess={setCaptchaToken}
							onTokenExpired={() => setCaptchaToken(null)}
							language='ru'
						/>
					</div>
					<Button
						type='submit'
						disabled={IsLoadingLogin}
						className='mt-4 w-full'
					>
						Войти
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}
