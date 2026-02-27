import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateExpenseSplitDto, EditExpenseSplitDto } from "./expensesplit.dto";

@Injectable()
export class ExpenseSplitService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.expenseSplit.findUnique({
      where: { id: id },
      include: {
        expense: true,
        user: true,
      },
    });
  }

  async create(data: CreateExpenseSplitDto) {
    return this.prisma.expenseSplit.create({
      data: {
        id: data.id,
        expenseId: data.expenseId,
        userId: data.userId,
        amountOwed: data.amountOwed,
      },
    });
  }

  async edit( data: EditExpenseSplitDto & { id: string } ) {
    return this.prisma.expenseSplit.update({
      where: { id: data.id },
      data: {
        amountOwed: data.amountOwed,
        status: data.status,
      },
    });
  }

  async delete( id: string ) {
    return this.prisma.expenseSplit.delete({
      where: { id },
    });
  }

  async list(query: any) {
  return this.prisma.expenseSplit.findMany({
    where: {
      userId: query.userId,
      status: query.status,
    },
    include: {
      expense: {
        include: {
          group: true,
          paidBy: true,
        }
      }
    },
    orderBy: {
      expense: {
        dateAdded: "desc"
      }
    }
  });
}

async findByUser(userId: string, status: string) {
  return this.prisma.expenseSplit.findMany({
    where: {
      userId,
      status: status === 'PAID' ? 'PAID' : 'UNPAID',
    },
    include: {
      expense: {
        include: {
          paidBy: true,
        },
      },
    },
  });
}


    
}