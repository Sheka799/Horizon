import z from 'zod'

export const NewPasswordSchema = z.object({
	password: z.string().min(8, {
		message: 'Пароль должен быть не менее 8 символов'
	})
})

export type TypeNewPasswordSchema = z.infer<typeof NewPasswordSchema>
