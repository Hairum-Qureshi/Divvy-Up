import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import type { ExpenseSplit, EditExpenseSplitDto } from '../interfaces';
import { getExpenseSplitsForUser, updateExpenseSplit } from '../integrations/fetcher';

export default function useUnpaidSplits(userId?: string) {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  // Load unpaid splits
  const splitsQuery = useQuery<ExpenseSplit[], Error>({
    queryKey: ['unpaid-splits', userId],
    enabled: !!userId,
    queryFn: async () => {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });
      return getExpenseSplitsForUser(userId as string, 'UNPAID', token);
    },
  });

  // Mutation: mark a split as PAID
  const markPaidMutation = useMutation({
    mutationFn: async (split: ExpenseSplit) => {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      const dto: EditExpenseSplitDto = {
        id: split.id,
        status: 'PAID',
        amountOwed: split.amountOwed,
      };

      return updateExpenseSplit(dto, token);
    },
    onSuccess: (_data, _variables, context) => {
      // refetch unpaid splits
      queryClient.invalidateQueries({ queryKey: ['unpaid-splits', userId] });
    },
  });

  return {
    ...splitsQuery,
    markPaid: markPaidMutation.mutateAsync,
    markPaidStatus: markPaidMutation.status,
  };
}
