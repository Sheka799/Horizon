import { prisma } from '@/libs/prisma';
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TokenType } from '@prisma/generated/prisma/enums';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmationDto } from './dto/confirmation.dto';
import { MailService } from '@/libs/mail/mail.service';
import { AuthService } from '../auth.service';
import { UserService } from '@/user/user.service';

@Injectable()
export class EmailConfirmationService {
    public constructor(
        private readonly mailService: MailService,
        private readonly userService: UserService,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) {}

    public async newVerification(req: Request, dto: ConfirmationDto) {
        const existingToken = await prisma.token.findUnique({
            where: {
                token: dto.token,
                type: TokenType.VERIFICATION
            }
        })

        if (!existingToken) {
            throw new NotFoundException(`Токен подтверждения не найден. Пожалуйста, убедитесь, что у вас правильный токен.`)
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired) {
            throw new BadRequestException('Токен подтверждения истек. Пожалуйста, запросите новый токен для подтверждения.')
        }

        const existingUser = await this.userService.findByEmail(existingToken.email)

        if (!existingUser) {
            throw new NotFoundException('Пользователь не найден. Пожалуйста, проверьте введенный адрес электронной почты и попробуйте снова.')
        }

        await prisma.user.update({
            where: {
                id: existingUser.id
            },
            data: {
                isVerified: true
            }
        })

        await prisma.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.VERIFICATION
            }
        })

        return this.authService.saveSession(req, existingUser)
    }

    public async sendVerificationToken(email: string) {
        const verificationToken = await this.generateVerificationToken(email)

        await this.mailService.sendConfirmationEmail(verificationToken.email, verificationToken.token)

        return true
    }

    private async generateVerificationToken(email: string) {
        const token = uuidv4()
        const expiresIn = new Date(new Date().getTime() + 3600 * 1000) // 1 hour

        const existingToken = await prisma.token.findFirst({
            where: {
                email,
                type: TokenType.VERIFICATION
            }
        })

        if (existingToken) {
            await prisma.token.delete({
                where: {
                    id: existingToken.id,
                    type: TokenType.VERIFICATION
                }
            })
        }

        const verificationToken = await prisma.token.create({
            data: {
                email,
                token,
                expiresIn,
                type: TokenType.VERIFICATION
            }
        })

        return verificationToken
    }
}
