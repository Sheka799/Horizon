import { isDev } from "@/libs/common/utils/is-dev.util";
import { ConfigService } from "@nestjs/config";
import { GoogleRecaptchaModuleOptions } from "@nestlab/google-recaptcha";

export const getRecaptchaConfig = (configService: ConfigService): GoogleRecaptchaModuleOptions => ({
    secretKey: configService.getOrThrow<string>('GOOGLE_RECAPTCHA_KEY'),
    response: req => req.headers.recaptcha as string,
    skipIf: isDev(configService)
})