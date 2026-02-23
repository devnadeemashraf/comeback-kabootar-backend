import { injectable } from 'tsyringe';

import type { UserDto } from '@/entities/user';
import type { EmailAddress } from '@/shared/types/entities';
import type { RequestUser } from '@/shared/types/express';

@injectable()
export class GetCurrentUserService {
  execute(user: RequestUser): UserDto {
    return {
      id: user.id,
      email: (user.email ?? '') as EmailAddress,
    };
  }
}
