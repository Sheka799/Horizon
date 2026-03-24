import { Module } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    UserModule
  ],
  providers: [TwoFactorAuthService],
  exports: [TwoFactorAuthService]
})
export class TwoFactorAuthModule {}
