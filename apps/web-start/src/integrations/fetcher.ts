import type {
  CreateExpenseDto,
  CreateExpenseSplitDto,
  CreateGroupDto,
  CreateMembershipDto,
  CreateSettlementDto,
  CreateUserDto,
  EditExpenseDto,
  EditExpenseSplitDto,
  EditGroupDto,
  EditMembershipDto,
  EditSettlementDto,
  EditUserDto,
  Expense,
  ExpenseSplit,
  FullGroup,
  Group,
  Membership,
  Settlement,
  User,
  UserBadge,
  SettlementForUser,
} from '../interfaces';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Base helper: no auth, just JSON + error handling
async function api<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(BASE_URL + endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  console.log('API RESPONSE STATUS →', res.status, endpoint);

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

// Auth helper: wraps api() and injects Authorization header
async function apiWithAuth<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  return api<T>(endpoint, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}

// User / Membership-related endpoints

// User's groups
export function getUserGroups(
  userId: string,
  token: string,
): Promise<Array<Group>> {
  console.log('getUserGroups called with userId:', userId);
  return apiWithAuth<Array<Group>>(`/membership/user/${userId}/groups`, token);
}

// User endpoints 
export function getUser(id: string, token: string): Promise<User> {
  return apiWithAuth<User>(`/user/${id}`, token);
}

export function createUser(
  data: CreateUserDto,
  token: string,
): Promise<User> {
  return apiWithAuth<User>('/user', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateUser(dto: EditUserDto, token: string): Promise<User> {
  return apiWithAuth<User>('/user/settings/update', token, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });
}

// Group endpoints

export function getGroup(id: string, token: string): Promise<FullGroup> {
  return apiWithAuth<FullGroup>(`/group/${id}`, token);
}

export function createGroup(
  data: CreateGroupDto,
  token: string,
): Promise<Group> {
  return apiWithAuth<Group>('/group/create', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateGroup(
  dto: EditGroupDto,
  token: string,
): Promise<Group> {
  return apiWithAuth<Group>(`/group/${dto.id}`, token, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

export function deleteGroup(id: string, token: string): Promise<void> {
  return apiWithAuth<void>(`/group/${id}`, token, {
    method: 'DELETE',
  });
}

// Membership endpoints

export function getMembership(
  id: string,
  token: string,
): Promise<Membership> {
  return apiWithAuth<Membership>(`/membership/${id}`, token);
}

export function createMembership(
  data: CreateMembershipDto,
  token: string,
): Promise<Membership> {
  return apiWithAuth<Membership>(
    `/group/add-member/${data.groupId}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify({ memberEmail: data.memberEmail }),
    },
  );
}

export function updateMembership(
  dto: EditMembershipDto,
  token: string,
): Promise<Membership> {
  return apiWithAuth<Membership>(`/membership/${dto.id}`, token, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

export function deleteMembership(
  groupID: string,
  memberID: string,
  token: string,
): Promise<void> {
  return apiWithAuth<void>(
    `/group/remove-member/${groupID}/${memberID}`,
    token,
    {
      method: 'DELETE',
    },
  );
}

// Expense endpoints

export function getExpense(id: string, token: string): Promise<Expense> {
  return apiWithAuth<Expense>(`/expense/${id}`, token);
}

export function getExpensesByGroup(
  groupId: string,
  token: string,
): Promise<Expense[]> {
  return apiWithAuth<Expense[]>(`/expense/group/${groupId}`, token);
}

export function createExpense(
  data: CreateExpenseDto,
  token: string,
): Promise<Expense> {
  return apiWithAuth<Expense>('/expense', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateExpense(
  dto: EditExpenseDto,
  token: string,
): Promise<Expense> {
  return apiWithAuth<Expense>(`/expense/${dto.id}`, token, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

export function deleteExpense(id: string, token: string): Promise<void> {
  return apiWithAuth<void>(`/expense/${id}`, token, {
    method: 'DELETE',
  });
}

// ExpenseSplit endpoints

export function getExpenseSplit(
  id: string,
  token: string,
): Promise<ExpenseSplit> {
  return apiWithAuth<ExpenseSplit>(`/expensesplit/${id}`, token);
}

export function createExpenseSplit(
  data: CreateExpenseSplitDto,
  token: string,
): Promise<ExpenseSplit> {
  return apiWithAuth<ExpenseSplit>('/expensesplit', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateExpenseSplit(
  dto: EditExpenseSplitDto,
  token: string,
): Promise<ExpenseSplit> {
  return apiWithAuth<ExpenseSplit>(`/expensesplit/${dto.id}`, token, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

export function deleteExpenseSplit(
  id: string,
  token: string,
): Promise<void> {
  return apiWithAuth<void>(`/expensesplit/${id}`, token, {
    method: 'DELETE',
  });
}

// splits for a user, with status filter
export function getExpenseSplitsForUser(
  userId: string,
  status: string,
  token: string,
): Promise<ExpenseSplit[]> {
  const params = new URLSearchParams({ userId, status }).toString();
  return apiWithAuth<ExpenseSplit[]>(`/expensesplit?${params}`, token);
}


// Settlement endpoints

export function getSettlement(
  id: string,
  token: string,
): Promise<Settlement> {
  return apiWithAuth<Settlement>(`/settlement/${id}`, token);
}

export function createSettlement(
  data: CreateSettlementDto,
  token: string,
): Promise<Settlement> {
  return apiWithAuth<Settlement>('/settlement', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateSettlement(
  dto: EditSettlementDto,
  token: string,
): Promise<Settlement> {
  return apiWithAuth<Settlement>(`/settlement/${dto.id}`, token, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

export function deleteSettlement(
  id: string,
  token: string,
): Promise<void> {
  return apiWithAuth<void>(`/settlement/${id}`, token, {
    method: 'DELETE',
  });
}

export function getSettlementsByUser(
  userId: string,
  token: string,
): Promise<SettlementForUser[]> {
  return apiWithAuth<SettlementForUser[]>(
    `/settlement/user/${userId}`,
    token,
  );
}

// Badges endpoints

export function getBadgesForUser(
  userId: string,
  token: string,
): Promise<UserBadge[]> {
  return apiWithAuth<UserBadge[]>(`/badges/user/${userId}`, token);
}

// Generic backend poster (authenticated)

export function backendPoster<T, U>(
  endpoint: string,
): (data: T) => Promise<U> {
  return (data: T) =>
    api<U>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
}
