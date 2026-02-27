import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { getExpensesByGroup } from '../integrations/fetcher';
import type { Expense } from '../interfaces';

export default function useGroupExpenses(groupId?: string) {
  const { getAccessTokenSilently } = useAuth0();

  return useQuery<Expense[], Error>({
    queryKey: ['groupExpenses', groupId],
    enabled: !!groupId,
    queryFn: async () => {
      const token = await getAccessTokenSilently({
        authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
    });

      return getExpensesByGroup(groupId as string, token);
    },
  });
}
