import z from 'zod'

export const LoginSchema = z.object({
	email: z.string().email({
		message: 'Введите корректный email'
	}),
	password: z.string().min(8, {
		message: 'Пароль должен быть не менее 8 символов'
	}),
	code: z.optional(z.string())
})

export type TypeLoginSchema = z.infer<typeof LoginSchema>
