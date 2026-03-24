import { FaGoogle, FaYandex } from 'react-icons/fa'

import { Button } from '@/shared/components/ui'

export function AuthSocial() {
	return (
		<>
			<div className='grid grid-cols-2 gap-6'>
				<Button variant='outline'>
					<FaGoogle className='mr-2 size-4' />
					Google
				</Button>
				<Button variant='outline'>
					<FaYandex className='mr-2 size-4' />
					Яндекс
				</Button>
			</div>
			<div className='relative mb-2 space-y-4'>
				<div className='absolute inset-0 flex h-full items-center'>
					<span className='w-full border-t'></span>
				</div>
				<div className='relative flex justify-center text-xs uppercase'>
					<span className='bg-card text-muted-foreground px-2'>
						Или
					</span>
				</div>
			</div>
		</>
	)
}
