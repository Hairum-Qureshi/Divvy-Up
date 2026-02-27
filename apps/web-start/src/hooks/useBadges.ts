import { useQuery } from '@tanstack/react-query';
import { getBadgesForUser } from '../integrations/fetcher';
import type { UserBadge } from '../interfaces';
import { useAuth0 } from '@auth0/auth0-react';

export default function useBadges(userId?: string) {

    const { getAccessTokenSilently } = useAuth0();

  return useQuery<UserBadge[], Error>({
    queryKey: ['badges', userId],
    enabled: !!userId, // only run when we have a userId
    queryFn: async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        return getBadgesForUser(userId as string, token)
    }
  });
}
