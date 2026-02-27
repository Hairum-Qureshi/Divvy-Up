import { Role } from '@repo/database';

export interface CreateMembershipDto {
  id?: string;
  userId: string;
  groupId: string;
  role: Role;
}

export interface EditMembershipDto {
  id: string;
  role?: Role;
}

export interface DeleteMembershipDto {
  id: string;
}
export { Role };
