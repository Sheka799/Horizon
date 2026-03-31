import { ToggleTheme } from "@/shared/components/ui"

export default function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<main className='flex h-screen w-full items-center justify-center px-4'>
			<ToggleTheme />
			{children}
		</main>
	)
}