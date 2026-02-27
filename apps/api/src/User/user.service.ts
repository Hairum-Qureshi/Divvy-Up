import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, EditUserDto } from './user.dto';
import { MailService } from 'src/Mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        groupsCreated: true,
        memberships: true,
        expensesPaid: true,
        paymentsMade: true,
        paymentsReceived: true,
      },
    });
  }

  async create(data: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        id: data.id,
        username: data.username,
        email: data.email,
      },
    });
  }

  async edit(data: EditUserDto) {
    return await this.prisma.user.update({
      where: { id: data.id },
      data: {
        username: data.username,
        email: data.email,
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  async updateUserSettings(userId: string, data: EditUserDto) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        username: data.username,
        email: data.email,
        profilePicture: data.profilePicture,
      },
    });
  }

  async deleteUserAccount(userId: string) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        throw new BadRequestException('User not found');
      }

      // Fetch all groups created by the user
      const groups = await this.prisma.group.findMany({
        where: { createdBy: userId },
      });

      for (const group of groups) {
        // Fetch all members other than the user
        const otherMembers = await this.prisma.membership.findMany({
          where: { groupId: group.id, userId: { not: userId } },
        });

        // Fetch all members (needed for checking if user is the only member)
        const allMembers = await this.prisma.membership.findMany({
          where: { groupId: group.id },
        });

        // if the user is the only member, then delete the group
        if (allMembers.length === 1) {
          await this.prisma.group.delete({
            where: { id: group.id },
          });
          continue;
        }

        // if the user is the admin and other users exist, then assign the admin role to another member
        if (otherMembers.length > 0) {
          // assign admin to `otherMembers[0]`
          const newAdminUID = otherMembers[0].userId;
          await this.prisma.membership.update({
            where: {
              userId_groupId: {
                userId: newAdminUID,
                groupId: group.id,
              },
            },
            data: {
              role: 'ADMIN',
            },
          });

          await this.prisma.group.update({
            where: { id: group.id },
            data: { createdBy: newAdminUID },
          });

          // send notification email to the user
          const newAdmin = await this.prisma.user.findUnique({
            where: { id: newAdminUID },
          });

          if (newAdmin) {
            await this.mailService.sendAdminTransferredGroupEmail(
              group.groupName,
              newAdmin.username,
              newAdmin.email,
            );

            console.log('Notification email sent to new admin.', newAdmin);
          } else {
            console.warn(
              `New admin user with ID ${newAdminUID} not found; cannot send notification email.`,
            );
            throw new BadRequestException('New admin user not found');
          }
        } else {
          // if no other members are found, then delete group
          await this.prisma.group.delete({
            where: { id: group.id },
          });
        }
      }

      // if the user is a member of any groups, they should be removed from those groups
      await this.prisma.membership.deleteMany({
        where: { userId },
      });

      // if the user has made any expense records, those records should be removed
      await this.prisma.expenseSplit.deleteMany({
        where: {
          expense: { paidById: userId },
        },
      });

      // Remove those expenses
      await this.prisma.expense.deleteMany({
        where: { paidById: userId },
      });

      // finally, we delete the user account
      return await this.prisma.user.delete({
        where: { id: userExists.id },
      });
    } catch (error) {
      throw new BadRequestException(
        'Error deleting user account: ' + (error as Error).message,
      );
    }
  }
}
