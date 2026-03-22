import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '@prisma/generated/prisma/enums'
import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
	public constructor(private readonly reflector: Reflector) {}

	public canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])
		const request = context.switchToHttp().getRequest()

		if (!roles) return true

		if (!roles.includes(request.user?.role as UserRole)) {
			throw new ForbiddenException(
				'У вас нет прав доступа к этому ресурсу'
			)
		}

		return true
	}
}
