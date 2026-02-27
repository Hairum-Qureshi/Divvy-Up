import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

enum BadgeId {
  FirstExpense    = 1,
  GroupOrganizer  = 2,
  Settler         = 3,
  FrequentSpender = 4,
  SuperOrganizer  = 5,
  MasterSettler   = 6,
  SocialButterfly = 7,
  BigSpender      = 8,
  GenerousPayer   = 9,
}

@Injectable()
export class BadgeService {
  constructor(private prisma: PrismaService) {}

  async getBadgesForUser(userId: string) {
    const userBadges = await this.prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true },
        orderBy: { awardedAt: 'desc' },
    });

    return userBadges.map((ub) => ({
        id: ub.badge.id,
        name: ub.badge.name,
        description: ub.badge.description,
        iconUrl: ub.badge.iconUrl,
        awardedAt: ub.awardedAt,
    }));
}

  async awardBadgeIfNotExists(userId: string, badgeId: BadgeId) {
    try {
        await this.prisma.userBadge.create({
            data: { userId, badgeId },
        });
    } catch (error) {
        // Badge already awarded, do nothing
    }
  }
  
  async onGroupCreated(userId: string) {
    const groupCount = await this.prisma.group.count({
        where: { createdBy: userId},
    });

    if (groupCount >= 1) {
        this.awardBadgeIfNotExists(userId, BadgeId.GroupOrganizer);
    }

    if (groupCount >= 5) {
        this.awardBadgeIfNotExists(userId, BadgeId.SuperOrganizer);
    }
  }

  async onExpenseCreated(paidById: string, amount: number, numSplits: number) {
    const expenseCount = await this.prisma.expense.count({
        where: { paidById },
    });

    if (expenseCount >= 1) {
        this.awardBadgeIfNotExists(paidById, BadgeId.FirstExpense);
    }

    if (expenseCount >= 10) {
        this.awardBadgeIfNotExists(paidById, BadgeId.FrequentSpender);
    }

    if (amount > 1000) {
        this.awardBadgeIfNotExists(paidById, BadgeId.BigSpender);
    }

    if (numSplits > 5) {
        this.awardBadgeIfNotExists(paidById, BadgeId.GenerousPayer);
    }
  }

  async onExpenseSettled(userId: string) {
    const settlementCount = await this.prisma.settlement.count({
        where: { payerId: userId },
    });

    if (settlementCount >= 1) {
        this.awardBadgeIfNotExists(userId, BadgeId.Settler);
    }

    if (settlementCount >= 10) {
        this.awardBadgeIfNotExists(userId, BadgeId.MasterSettler);
    }
  }

  async onGroupJoined(userId: string) {
    const groupMemberships = await this.prisma.membership.count({
        where: { userId },
    });

    if (groupMemberships >= 3) {
        this.awardBadgeIfNotExists(userId, BadgeId.SocialButterfly);
    }
  }
}