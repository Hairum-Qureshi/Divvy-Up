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