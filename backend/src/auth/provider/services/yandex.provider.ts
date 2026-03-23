import { BaseOAuthService } from "./base-oauth.service";
import { TypeProviderOptions } from "./types/provider-options.types";
import { TypeUserInfo } from "./types/user-info.types";

interface YandexProfile {
    id: string;
    login: string;
    client_id: string;
    display_name?: string;
    real_name?: string;
    first_name?: string;
    last_name?: string;
    sex?: 'male' | 'female' | null;
    default_email?: string;
    emails?: string[];
    default_avatar_id?: string;
    is_avatar_empty?: boolean;
    psuid?: string;
}

export class YandexProvider extends BaseOAuthService {
    public constructor(options: TypeProviderOptions) {
        super({
            name: 'yandex',
            authorize_url: 'https://oauth.yandex.ru/authorize',
            access_url: 'https://oauth.yandex.ru/token',
            profile_url: 'https://login.yandex.ru/info?format=json',
            scopes: options.scopes,
            client_id: options.client_id,
            client_secret: options.client_secret
        })
    }

    public async extractUserInfo(data: YandexProfile): Promise<TypeUserInfo> {
        const email = data.default_email || data.emails?.[0] || '';

        return super.extractUserInfo({
            email,
            name: data.display_name,
            picture: data.default_avatar_id ? `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-200` : undefined
        })
    }
}