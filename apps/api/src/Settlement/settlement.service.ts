import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateSettlementDto, EditSettlementDto } from "./settlement.dto";
import { BadgeService } from "src/Badge/badge.service";

@Injectable()
export class SettlementService {
    constructor(
        private prisma: PrismaService,
        private badgeService: BadgeService,
    ) {}  

    async findOne(id: string) {
        return this.prisma.settlement.findUnique({
            where: { id: id },
            include: {
                payer: true,
                receiver: true,
                group: true,
            },
        });
    }

    async create(data: CreateSettlementDto ) {

        const settlement =  await this.prisma.settlement.create({
            data: {
                id: data.id,
                amount: data.amount,
                group: { connect: { id: data.groupId } },
                payer: { connect: { id: data.payerId } },
                receiver: { connect: { id: data.receiverId } },
            },
        });

        await this.badgeService.onExpenseSettled(data.payerId);

        return settlement;
        
    }

    async edit( data: EditSettlementDto ) {
        return this.prisma.settlement.update({
            where: { id: data.id },
            data: {
                amount: data.amount,
                dateSettled: data.dateSettled,
            },
        });
    }

    async delete( id: string ) {
        return this.prisma.settlement.delete({
            where: { id },
        });
    } 

    async findByUser(userId: string) {
        return this.prisma.settlement.findMany({
            where: {
                OR: [
                    { payerId: userId },
                    { receiverId: userId },
                ],
            },
            include: {
                payer: true,
                receiver: true,
                group: true,
            },
            orderBy: { dateSettled: 'desc' },
        });
    }

}