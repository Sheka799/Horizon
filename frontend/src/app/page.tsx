import { buttonVariants } from "@/shared/components/ui";
import { ROUTES } from "@/shared/config";
import Link from "next/link";

export default function Home() {
	return (
		<div className='space-y-5 text-center'>
			<h1 className='text-4xl font-bold'>Главная страница</h1>
			<Link href={ROUTES.AUTH.LOGIN} className={buttonVariants()}>
				Войти в аккаунт
			</Link>
		</div>
	)
}
