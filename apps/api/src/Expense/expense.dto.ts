export interface CreateExpenseDto {
  id?: string;
  amount: number;
  description: string;
  dateAdded?: Date;
  groupId: string;
  paidById: string;

  memberIds?: string[]
}

export interface EditExpenseDto {
  id: string;
  amount?: number;
  description?: string;
  dateAdded?: Date;
}