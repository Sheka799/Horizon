import { useQuery } from '@tanstack/react-query'

import { userServive } from '@/features/user/services'

export function useProfile() {
	const { data: user, isLoading } = useQuery({
		queryKey: ['profile'],
		queryFn: () => userServive.findProfile()
	})

	return {
		user,
		isLoading
	}
}
