import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { Request } from 'express'

import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from './csrf.constants'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])
const EXCLUDED_PREFIXES = ['/auth']

@Injectable()
export class CsrfGuard implements CanActivate {
	public canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>()

		if (SAFE_METHODS.has(request.method)) {
			return true
		}

		if (EXCLUDED_PREFIXES.some(prefix => request.path.startsWith(prefix))) {
			return true
		}

		const cookieToken = request.cookies?.[CSRF_COOKIE_NAME] as
			| string
			| undefined
		const headerToken = request.headers[CSRF_HEADER_NAME] as
			| string
			| undefined

		if (!cookieToken || !headerToken || cookieToken !== headerToken) {
			throw new ForbiddenException(
				'Не удалось подтвердить CSRF-токен. Обновите страницу и попробуйте снова.'
			)
		}

		return true
	}
}
