import { useAuth0 } from '@auth0/auth0-react';
import { useApiMutation } from '../integrations/api';

interface UseUserHook {
  handleEditUserSettings: (
    currUID: string | undefined,
    username: string | undefined,
    profilePicture: string | undefined,
    email: string | undefined,
  ) => void;
  deleteProfile: () => void;
}

export default function useUser(): UseUserHook {
  const { logout } = useAuth0();

  // Need to call this mutation because the /user/settings/update endpoint requires auth and this will pass the Bearer token automatically
  const updateSettings = useApiMutation({
    path: '/user/settings/update',
    method: 'PATCH',
    invalidateKeys: [['users', 'me']],
  });

  function handleEditUserSettings(
    currUID: string | undefined,
    username: string | undefined,
    profilePicture: string | undefined,
    email: string | undefined,
  ) {
    if (!currUID || !username || !email || !profilePicture) return;

    updateSettings.mutate({
      username,
      email,
      profilePicture,
    });
  }

  const deleteAccount = useApiMutation({
    path: '/user/settings/delete',
    method: 'DELETE',
    onSuccess: () => {
      logout({
        logoutParams: { returnTo: window.location.origin + '/join' },
      });
    },
  });

  function deleteProfile() {
    const confirmation = confirm(
      'Are you sure you would like to delete your account? This action cannot be undone.',
    );
    if (!confirmation) return;

    deleteAccount.mutate({});
  }

  return { handleEditUserSettings, deleteProfile };
}
