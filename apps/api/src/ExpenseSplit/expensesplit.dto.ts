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