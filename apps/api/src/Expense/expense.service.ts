import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateExpenseDto, EditExpenseDto } from "./expense.dto";
import { BadgeService } from "src/Badge/badge.service";


@Injectable()
export class ExpenseService {
  constructor(
    private prisma: PrismaService,
    private badgeService: BadgeService,
  ) {}

  async findOne(id: string) {
    return this.prisma.expense.findUnique({
      where: { id: id },
    });
  }

  async findByGroup(groupId: string) {
    return this.prisma.expense.findMany({
      where: { groupId: groupId },
    });
  }

  async create(data: CreateExpenseDto) {
    //debug
    console.log('ExpenseService.create data:', data);
    const {
      amount,
      description,
      groupId,
      paidById,
      dateAdded,
      memberIds,
    } = data;

    let splitsData:
      | { userId: string; amountOwed: number }[]
      | undefined;

    if (memberIds && memberIds.length > 0) {
      const perPerson = amount / memberIds.length;

      splitsData = memberIds.map((userId) => ({
        userId,
        amountOwed: perPerson,
      }));
    }

    await this.badgeService.onExpenseCreated(paidById, amount, memberIds ? memberIds.length : 0);

    return this.prisma.expense.create({
      data: {
        amount,
        description,
        ...(dateAdded ? { dateAdded } : {}),
        group: { connect: { id: groupId } },
        paidBy: { connect: { id: paidById } },
        ...(splitsData
          ? {
              splits: {
                create: splitsData,
              },
            }
          : {}),
      },
    });

  }

  async edit( data: EditExpenseDto ) {
    return this.prisma.expense.update({
      where: { id: data.id },
      data: {
        amount: data.amount,
        description: data.description,
        dateAdded: data.dateAdded,
      },
    });
  }

  async delete( id: string ) {
    return this.prisma.expense.delete({
      where: { id },
    });
  }
    
}