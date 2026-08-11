'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SmartCaptcha } from '@yandex/smart-captcha'
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

import { useRegisterMutation } from '../hooks'
import { RegisterSchema, TypeRegisterSchema } from '../schemes'

import { AuthWrapper } from './AuthWrapper'

export function RegisterForm() {
	const [captchaToken, setCaptchaToken] = useState<string | null>(null)
	const [captchaKey, setCaptchaKey] = useState(0)

	const form = useForm<TypeRegisterSchema>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			passwordRepeat: ''
		}
	})

	const { register, IsLoadingRegister } = useRegisterMutation()

	const resetCaptcha = () => {
		setCaptchaToken(null)
		setCaptchaKey(prev => prev + 1)
	}

	const onSubmit = (values: TypeRegisterSchema) => {
		if (!captchaToken) {
			toast.error('Пожалуйста, подтвердите, что вы не робот')
			return
		}

		const tokenToSend = captchaToken
		resetCaptcha()

		register({ values, recaptcha: tokenToSend })
	}

	return (
		<AuthWrapper
			heading='Регистрация'
			description='Создайте новый аккаунт и&nbsp;начните пользоваться всеми преимуществами нашего сервиса'
			backButtonLabel='Уже есть аккаунт? Войти'
			backButtonHref={ROUTES.AUTH.LOGIN}
			isShowSocials
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid gap-2 space-y-2'
				>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Имя</FormLabel>
								<FormControl>
									<Input
										placeholder='Введите ваше имя'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
								<FormLabel>Пароль</FormLabel>
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
					<FormField
						control={form.control}
						name='passwordRepeat'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Повторите пароль</FormLabel>
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
						disabled={IsLoadingRegister}
						className='mt-4 w-full'
					>
						Зарегистрироваться
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}
