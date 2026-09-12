import { SmartCaptchaGuard } from "./smart-captcha.guard";

describe('SmartCaptchaGuard', () => {
    const guard = new SmartCaptchaGuard({} as any);
    const mockContext: any = {
        switchToHttp: () => ({ getRequest: () => ({ headers: {  } }) })
    }

    it('Проверка яндекс капчи', async () => {
        await expect(guard.canActivate(mockContext)).rejects.toThrow('Токен капчи не передан');
    });

    const guardWithToken = new SmartCaptchaGuard({ getOrThrow: jest.fn().mockReturnValue('fake-secret') } as any);

    afterEach(() => {
        jest.restoreAllMocks()
    })
    
    it('Проверка яндекс капчи с токеном', async () => {
        mockContext.switchToHttp = () => ({ getRequest: () => ({ headers: { 'smart-token': 'test' }, ip: '' }) })
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: () => Promise.resolve({ status: 'ok' })
        } as any)
        await expect(guardWithToken.canActivate(mockContext)).resolves.toBe(true);
    })
});