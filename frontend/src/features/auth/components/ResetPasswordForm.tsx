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

import { useResetPasswordMutation } from '../hooks'
import { ResetPasswordSchema, TypeResetPasswordSchema } from '../schemes'

import { AuthWrapper } from './AuthWrapper'

export function ResetPasswordForm() {
	const [captchaToken, setCaptchaToken] = useState<string | null>(null)
	const [captchaKey, setCaptchaKey] = useState(0)

	const form = useForm<TypeResetPasswordSchema>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			email: ''
		}
	})

	const { reset, isLoadingReset } = useResetPasswordMutation()

	const resetCaptcha = () => {
		setCaptchaToken(null)
		setCaptchaKey(prev => prev + 1)
	}

	const onSubmit = (values: TypeResetPasswordSchema) => {
		if (!captchaToken) {
			toast.error('Пожалуйста, подтвердите, что вы не робот')
			return
		}

		const tokenToSend = captchaToken
		resetCaptcha()

		reset({ values, recaptcha: tokenToSend })
	}

	return (
		<AuthWrapper
			heading='Сброс пароля'
			description='Введите ваш email, чтобы получить ссылку на сброс пароля'
			backButtonLabel='Войти в аккаунт'
			backButtonHref={ROUTES.AUTH.LOGIN}
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid gap-2 space-y-2'
				>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										disabled={isLoadingReset}
										placeholder='Введите ваш email'
										type='email'
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
						disabled={isLoadingReset}
						className='mt-4 w-full'
					>
						Сбросить пароль
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}
