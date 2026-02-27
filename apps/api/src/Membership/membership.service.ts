import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMembershipDto, EditMembershipDto, Role } from './membership.dto';
import { JwtUser } from 'src/auth/jwt.strategy';
import { BadgeService } from 'src/Badge/badge.service'; 

@Injectable()
export class MembershipService {
  constructor(
    private prisma: PrismaService,
    private badgeService: BadgeService,
  ) {}

  async findOne(id: string) {
    return await this.prisma.membership.findUnique({
      where: { id },
      include: {
        user: true,
        group: true,
      },
    });
  }

  async create(data: CreateMembershipDto) {
    const membership = await this.prisma.membership.create({
      data: {
        id: data.id,
        user: { connect: { id: data.userId } },
        group: { connect: { id: data.groupId } },
        role: data.role,
      },
    });

    await this.badgeService.onGroupJoined(data.userId);

    return membership;
  }

  async edit(data: EditMembershipDto) {
    return await this.prisma.membership.update({
      where: { id: data.id },
      data: {
        role: data.role as Role,
      },
    });
  }

  async findGroupsForUser(auth: JwtUser) {
    const memberships = await this.prisma.membership.findMany({
      where: { userId: auth.userId },
      include: { group: true },
    });

    return memberships.map((m) => m.group);
  }

  async delete(id: string) {
    return await this.prisma.membership.delete({
      where: { id },
    });
  }
}
