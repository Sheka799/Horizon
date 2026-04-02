'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
	Button,
	Card,
	CardContent,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Loader,
	Switch
} from '@/shared/components/ui'

import { useProfile, useUpdateProfileMutation } from '../hooks'
import { SettingSchema, TypeSettingSchema } from '../schemes'

export function SettingsForm() {
	const { user, isLoading } = useProfile()

	const form = useForm<TypeSettingSchema>({
		resolver: zodResolver(SettingSchema),
		values: {
			name: user?.displayName || '',
			email: user?.email || '',
			isTwoFactorEnabled: user?.isTwoFactorEnabled || false
		}
	})

	const { update, isLoadingUpdate } = useUpdateProfileMutation()

	const onSubmit = (values: TypeSettingSchema) => {
		update(values)
	}

	if (!user) return null

	return (
		<Card className='w-[400px]'>
			<CardContent>
				{isLoading ? (
					<Loader />
				) : (
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
												disabled={isLoadingUpdate}
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
												disabled={isLoadingUpdate}
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
								name='isTwoFactorEnabled'
								render={({ field }) => (
									<FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
										<div className='space-y-0.5'>
											<FormLabel>
												Двухфакторная аутентификация
											</FormLabel>
											<FormDescription>
												Включите двухфакторную
												футентификацию для вашей учетной
												записи
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<Button type='submit' disabled={isLoadingUpdate}>
								Сохранить
							</Button>
						</form>
					</Form>
				)}
			</CardContent>
		</Card>
	)
}
