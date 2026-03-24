import { Body, Heading, Tailwind, Text } from "@react-email/components"
import { Html } from "@react-email/html"
import * as React from 'react'

interface TwoFactorAuthTemplateProps {
    token: string
}

export function TwoFactotAuthTemplate({token}: TwoFactorAuthTemplateProps) {
    return (
        <Tailwind>
            <Html>
                <Body className="text-black">
                    <Heading>Двухфакторная аутентификация</Heading>
                    <Text>Ваш код двухфакторной аутентификации: <strong>{token}</strong></Text>
                    <Text>Пожалуйста, введите этот код в приложении для завершения аутентификации.</Text>
                    <Text>Если вы не запрашивали этот код, проигнорируйте данное сообщение.</Text>
                </Body>
            </Html>
        </Tailwind>
    )
}