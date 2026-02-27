import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateGroupDto, EditGroupDto } from './group.dto';
import { MailService } from 'src/Mail/mail.service';
import { JwtUser } from 'src/auth/jwt.strategy';
import { BadgeService } from 'src/Badge/badge.service';

@Injectable()
export class GroupService {
  constructor(
    private prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly badgeService: BadgeService,
  ) {}

  async findAll() {
    return await this.prisma.group.findMany({
      include: {
        creator: true,
        members: true,
        expenses: true,
        settlements: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.group.findUnique({
      where: { id },
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
        expenses: true,
        settlements: true,
      },
    });
  }

  async create(auth: JwtUser, data: CreateGroupDto) {
    const currUID = auth?.userId;
    const { id, groupName, groupMembersEmails, groupType } = data;

    // check if any of the emails contain 'google-oauth2-' prefix
    for (const email of groupMembersEmails) {
      if (email.startsWith('google-oauth2_')) {
        throw new BadRequestException(
          'One or more email addresses are not linked to Google accounts. Cannot create group.',
        );
      }
    }

    const users = await this.prisma.user.findMany({
      where: { email: { in: groupMembersEmails } },
    });

    // check if users exist
    if (!users || users.length === 0) {
      throw new BadRequestException(
        'No users found with the provided email addresses.',
      );
    }

    // checks if all the emails correspond to existing users in the User table
    if (users.length !== groupMembersEmails.length) {
      throw new BadRequestException(
        'One or more email addresses do not correspond to existing users.',
      );
    }

    const memberUIDs = [...users.map((u) => u.id), currUID];

    // create the Group first
    const group = await this.prisma.group.create({
      data: {
        id,
        groupName,
        groupType,
        createdBy: currUID, // this is the adminUID
      },
    });

    // create the Memberships
    await this.prisma.membership.createMany({
      data: memberUIDs.map((uid) => ({
        groupId: group.id,
        userId: uid,
        role: uid === currUID ? 'ADMIN' : 'MEMBER',
      })),
    });

    // 4 — Optionally return full group with members
    const fullGroup = await this.prisma.group.findUnique({
      where: { id: group.id },
      include: {
        members: true,
        creator: true,
      },
    });

    await this.badgeService.onGroupCreated(currUID);

    return { status: HttpStatus.CREATED, id: fullGroup?.id };
  }

  async edit(data: EditGroupDto) {
    return await this.prisma.group.update({
      where: { id: data.id },
      data: {
        groupName: data.groupName,
      },
    });
  }

  async delete(id: string) {
    // first delete all memberships associated with this group
    await this.prisma.membership.deleteMany({
      where: { groupId: id },
    });

    // then delete the group itself
    return await this.prisma.group.delete({
      where: { id },
    });
  }

  async removeMember(groupId: string, memberId: string) {
    // check if the groupId is valid
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new Error('Group not found');
    }

    // check if the memberId is valid
    const membership = await this.prisma.membership.findFirst({
      where: {
        groupId,
        userId: memberId,
      },
      include: { user: true },
    });

    if (!membership) {
      throw new Error('Member not found in the specified group');
    }

    // remove the user from the group
    await this.prisma.membership.deleteMany({
      where: {
        groupId,
        userId: memberId,
      },
    });

    const groupAdmin = await this.prisma.user.findUnique({
      where: { id: group.createdBy },
    });

    if (groupAdmin) {
      // send email to the user letting them know they have been removed from the group as well as to the group admin letting them know a change in their group's members
      await this.mailService.sendUserRemovedFromGroupEmail(
        group.groupName,
        membership.user.username,
        membership.user.email,
        groupAdmin.email,
        groupAdmin.username,
      );
    }

    return { message: 'Member removed successfully' };
  }

  async addMember(groupId: string, memberEmail: string) {
    try {
      // Check if the user exists
      const user = await this.prisma.user.findUnique({
        where: { email: memberEmail },
      });

      if (!user) {
        return {
          message: 'User not found',
        };
      }

      // check if the group id is valid
      const group = await this.prisma.group.findUnique({
        where: { id: groupId },
      });

      if (!group) {
        return {
          message: 'Group not found',
        };
      }

      // check if the user's email address does not contain 'google-oauth2-' prefix; it must be a Google-linked email
      if (user.email.startsWith('google-oauth2_')) {
        return {
          message:
            'User email is not linked to a Google account. Cannot add to group.',
        };
      }

      // check if the user is already a member of the group
      const existingMembership = await this.prisma.membership.findFirst({
        where: {
          groupId,
          userId: user.id,
        },
      });

      if (existingMembership) {
        return {
          message: 'User is already a member of the group',
        };
      }

      // add the user to the group with role as MEMBER
      await this.prisma.membership.create({
        data: {
          user: { connect: { id: user.id } },
          group: { connect: { id: groupId } },
          role: 'MEMBER',
        },
      });
    } catch (err) {
      console.error('Error sending email:', err);
      return {
        message: 'Failed to add member',
      };
    }
  }
}
