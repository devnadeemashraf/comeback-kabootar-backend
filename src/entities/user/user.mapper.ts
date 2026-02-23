import { UserDto } from './user.dto';
import { User, UserRow } from './user.entity';

export function mapUserRowToDomain(row: UserRow): User {
  return {
    id: row.id,
    email: row.email as User['email'],
    isPremium: row.is_premium,
    credits: row.credits,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

export function mapUserDomainToRow(domain: User): UserRow {
  return {
    id: domain.id,
    email: domain.email as User['email'],
    is_premium: domain.isPremium,
    credits: domain.credits,
    created_at: domain.createdAt,
    updated_at: domain.updatedAt,
    deleted_at: domain.deletedAt,
  };
}

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    email: user.email as User['email'],
  };
}
