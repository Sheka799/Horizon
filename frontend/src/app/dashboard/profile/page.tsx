import { SettingsForm } from "@/features/user/components"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: 'Настройки профиля'
}

export default function ProfilePage() {
    return <SettingsForm />
}