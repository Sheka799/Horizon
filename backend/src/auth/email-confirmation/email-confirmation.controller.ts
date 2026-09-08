import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { Request } from 'express';
import { ConfirmationDto } from './dto/confirmation.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth/email-confirmation')
export class EmailConfirmationController {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  @HttpCode(HttpStatus.OK)
  public async newVerification(@Req() req: Request, @Body() dto: ConfirmationDto) {
    return this.emailConfirmationService.newVerification(req, dto)
  }
}
