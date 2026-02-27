import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SendEmailDTO } from './email.dto';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private prisma: PrismaService) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(sendEmailDTO: SendEmailDTO): Promise<any> {
    const { toEmail, adminName, groupID } = sendEmailDTO;

    // Check if the user exists
    const user = await this.prisma.user.findUnique({
      where: { email: toEmail },
    });

    if (!user) {
      return {
        message: 'User not found',
      };
    }

    // check if the group id is valid
    const group = await this.prisma.group.findUnique({
      where: { id: groupID },
      include: { members: true },
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

    // check if the user the admin wants to invite is already in the group
    if (group.members.some((member) => member.userId === user.id)) {
      return {
        message: 'User is already a member of the group',
      };
    }

    try {
      await this.resend.emails.send({
        from: `DivvyUp <${process.env.EMAIL}>`,
        to: toEmail,
        subject: "You've been added to a group!",
        html: `
            <p>Hi there,</p>
            <p>${adminName} has added you to the group "${group.groupName}". Click <a href="${process.env.FRONTEND_URL}/group/${groupID}/details">here</a> to view the group.</p>
            <br/>
            <p>Best regards,</p>
            <p>Divvy Up</p>
          `,
      });

      return {
        message: `Invite notification email successfully sent to ${sendEmailDTO.toEmail}!`,
      };
    } catch (err) {
      console.error('Error sending email:', err);
      return {
        message: 'Failed to send email',
      };
    }
  }

  async sendUserRemovedFromGroupEmail(
    groupName: string,
    username: string,
    userEmail: string,
    adminEmail: string,
    adminName: string,
  ) {
    try {
      await this.resend.emails.send({
        from: `DivvyUp <${process.env.EMAIL}>`,
        to: userEmail,
        subject: 'Update regarding your group membership',
        html: `
        <p>Hi ${username},</p>
        <p>This is to let you know that your membership in the group "${groupName}" has ended. If you have any questions or concerns, you may reach out to the group administrator.</p>
        <p>Best regards,</p>
        <p>DivvyUp</p>
      `,
      });

      // Notify the group admin 
      await this.resend.emails.send({
        from: `DivvyUp <${process.env.EMAIL}>`,
        to: adminEmail,
        subject: 'Update regarding your group membership',
        html: `
        <p>Hi ${adminName},</p>
        <p>This is to let you know that ${username} is no longer apart of your group, "${groupName}". If you are aware of this change because you removed them, please discard this email.</p>
        <p>Best regards,</p>
        <p>DivvyUp</p>
      `,
      });
    } catch (err) {
      console.error('Error sending removal email:', err);
      throw new Error('Failed to send removal email');
    }
  }

  async sendAdminTransferredGroupEmail(
    groupName: string,
    newAdminName: string,
    newAdminEmail: string,
  ) {
    try {
      await this.resend.emails.send({
        from: `DivvyUp <${process.env.EMAIL}>`,
        to: newAdminEmail,
        subject: `You are now the admin of the group "${groupName}"`,
        html: `
            <p>Hi ${newAdminName},</p>
            <p>You have been made the admin of the group "${groupName}". You can now manage group settings and members.</p>
            <br/>
            <p>Best regards,</p>
            <p>Divvy Up</p>
          `,
      });
    } catch (err) {
      console.error('Error sending admin transfer email:', err);
      throw new Error('Failed to send admin transfer email');
    }
  }
}
