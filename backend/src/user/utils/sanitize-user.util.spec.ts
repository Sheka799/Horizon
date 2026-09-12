import { sanitizeUser } from "./sanitize-user.util";
import { Account, User } from "@prisma/generated/prisma/client";

describe("sanitizeUser", () => {
    const accounts = [
        {
            id: 'test',
            refreshToken: 'test',
            accessToken: 'test',
            userId: 'string'
        }
    ] as Account[];

    const user = {
        id: 'string',
        email: 'test@test.ru',
        password: 'string'
    } as User;

    let data: User & { accounts: Account[] };

    beforeEach(() => {
        data = {
            ...user,
            accounts: structuredClone(accounts)
        };
    })

    it('Проверка на удаление пароля', () => {
        const result = sanitizeUser(data);

        expect(result).not.toHaveProperty('password');
    });

    it('Проверка на удаление токенов в аккаунтах', () => {

        const result = sanitizeUser(data);

        expect(result.accounts).toBeDefined()
        expect(result.accounts![0]).not.toHaveProperty('refreshToken');
        expect(result.accounts![0]).not.toHaveProperty('accessToken');
    });
});