import { useMutation } from '@tanstack/react-query';
import { backendPoster } from '../integrations/fetcher';

interface SendEmailParams {
  sendEmailMutation: ({
    groupID,
    toEmail,
    adminName,
  }: {
    groupID: string;
    toEmail: string;
    adminName: string;
  }) => void;
}

export default function useEmail(): SendEmailParams {
  
  const { mutate: sendEmailMutation } = useMutation({
    mutationFn: async ({
      groupID,
      toEmail,
      adminName,
    }: {
      groupID: string;
      toEmail: string;
      adminName: string;
    }) => {
      try {
        const result = await backendPoster<
          {
            groupID: string;
            toEmail: string;
            adminName: string;
          },
          any
        >('/mail/send-invite-notif-email')({
          groupID,
          toEmail,
          adminName,
        });

        alert(result.message);
      } catch (error) {
        console.error(error);
        alert(
          (error as Error).message ||
            'An error occurred while sending the email.',
        );
      }
    },
  });

  return { sendEmailMutation };
}
