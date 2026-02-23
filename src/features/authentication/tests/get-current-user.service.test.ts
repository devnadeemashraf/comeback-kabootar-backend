import { GetCurrentUserService } from '../service/get-current-user.service';

describe('GetCurrentUserService', () => {
  it('returns UserDto from RequestUser', () => {
    const service = new GetCurrentUserService();
    const user = { id: 'user-1', email: 'test@example.com' };
    const result = service.execute(user);
    expect(result).toEqual({ id: 'user-1', email: 'test@example.com' });
  });

  it('uses empty string when email is missing', () => {
    const service = new GetCurrentUserService();
    const result = service.execute({ id: 'user-2' });
    expect(result).toEqual({ id: 'user-2', email: '' });
  });
});
