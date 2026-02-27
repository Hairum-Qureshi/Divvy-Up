export type Role = 'ADMIN' | 'MEMBER';
export type Status = 'PAID' | 'UNPAID';
export type GroupType = 'TRIP' | 'HOUSEHOLD' | 'EVENT' | 'OTHER';

// User
export interface User {
  id: string;
  username: string;
  email: string;
  joinDate: string;
  profilePicture: string;
}

// Group
export interface Group {
  id: string;
  groupName: string;
  groupType: GroupType;
  createdBy: string;
  createdAt: string;
}

// Membership
export interface Membership {
  id: string;
  userId: string;
  groupId: string;
  role: Role;
}

// Expense
export interface Expense {
  id: string;
  groupId: string;
  paidById: string;
  amount: number;
  description: string;
  dateAdded: string;
}

// ExpenseSplit
export interface ExpenseSplit {
  id: string;
  expenseId: string;
  userId: string;
  amountOwed: number;
  status: 'PAID' | 'UNPAID';

  expense?: {
    id: string;
    description: string;
    dateAdded: string; // or Date
    amount: number;

    paidBy?: {
      id: string;
      username: string;
      email: string;
      profilePicture?: string;
    };
  };

  user?: {
    id: string;
    username: string;
  };
}


// Settlement
export interface Settlement {
  id: string;
  groupId: string;
  payerId: string;
  receiverId: string;
  amount: number;
  dateSettled: string;
  status: string;
}

// Expense DTOs
export interface CreateExpenseDto {
  id?: string;
  amount: number;
  description: string;
  dateAdded?: Date;
  groupId: string;
  paidById: string;

  //new
  splitEvenly?: boolean;
  memberIds?: string[];
}

export interface EditExpenseDto {
  id: string;
  amount?: number;
  description?: string;
  dateAdded?: Date;
}

// ExpenseSplit DTOs
export interface CreateExpenseSplitDto {
  id?: string;
  expenseId: string;
  userId: string;
  amountOwed: number;
}

export interface EditExpenseSplitDto {
  id: string;
  amountOwed?: number;
  status?: 'PAID' | 'UNPAID';
}

// Group DTOs
export interface CreateGroupDto {
  id: string;
  groupName: string;
  groupMembersEmails: Array<string>;
  groupType: string;
}

export interface EditGroupDto {
  id: string;
  groupName?: string;
}

export interface DeleteGroupDto {
  id: string;
}

// Membership DTOs
export interface CreateMembershipDto {
  id?: string;
  memberEmail: string;
  groupId: string;
  role?: Role;
}

export interface EditMembershipDto {
  id: string;
  role?: Role;
}

export interface DeleteMembershipDto {
  id: string;
}

// Settlement DTOs
export interface CreateSettlementDto {
  id?: string;
  groupId: string;
  payerId: string;
  receiverId: string;
  amount: number;
}

export interface EditSettlementDto {
  id: string;
  amount?: number;
  dateSettled?: Date;
}

export interface DeleteSettlementDto {
  id: string;
}

export interface SettlementForUser extends Settlement {
  payer: User;
  receiver: User;
  group: Group;
}

// User DTOs
export interface CreateUserDto {
  id?: string;
  username: string;
  email: string;
  password: string;
}

export interface EditUserDto {
  id: string;
  username?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
}

export interface DeleteUserDto {
  id: string;
}

export interface HydratedMembership extends Membership {
  user: User;
}

// A fully hydrated group
export interface FullGroup extends Group {
  creator: User;
  members: Array<HydratedMembership>;
  expenses: Array<Expense>;
  settlements: Array<Settlement>;
}

export interface GroupMember {
  id: string;
  username: string;
  email: string;
  joinDate: string;
  role: Role;
  profilePicture: string;
}

export interface MemberCardProps {
  groupID: string;
  memberID: string;
  username: string;
  userEmail: string;
  userProfilePicture: string;
  isAdmin: boolean;
  isCurrentUserAdmin: boolean;
  adminUID: string;
}

export interface CreateGroupParams {
  handleCreateGroup: (
    groupName: string,
    groupMembersEmails: Array<string>,
    groupType: string,
  ) => void;
  handleDeleteGroup: (groupID: string) => void;
  handleAddMember: (groupID: string, memberID: string) => void;
  handleRemoveUser: (groupID: string, memberID: string) => void;
  isRemovingUser: boolean;
  isLoadingGroups: boolean;
  groups: Array<Group> | undefined;
  error: Error | null;
  groupMembers: Array<GroupMember> | undefined;
  groupMembersisLoading: boolean;
  groupMembersError: Error | null;
  checkAdmin: (groupMembers: Array<GroupMember> | undefined) => boolean;
}

export interface UserBadge {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  awardedAt: string;
}

