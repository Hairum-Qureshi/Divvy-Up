import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import {
  createMembership,
  deleteGroup,
  deleteMembership,
  getGroup,
} from '../integrations/fetcher';
import {
  useApiMutation,
  useApiQuery,
  useCurrentUser,
} from '../integrations/api';
import type {
  CreateGroupParams,
  FullGroup,
  Group,
  GroupMember,
} from '../interfaces';

export default function useGroups(groupID?: string): CreateGroupParams {
  const { data: currUserData } = useCurrentUser();
  const { getAccessTokenSilently } = useAuth0();

  // Source - https://stackoverflow.com/a/8809472
  // Posted by Briguy37, modified by community. See post 'Timeline' for change history
  // Retrieved 2025-11-12, License - CC BY-SA 4.0
  function generateUUID() {
    // Public Domain/MIT
    let d = new Date().getTime();
    let d2 =
      (typeof performance !== 'undefined' && performance.now() * 1000) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        let r = Math.random() * 16;
        if (d > 0) {
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      },
    );
  }

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = currUserData?.id || '';

  const createGroupMutation = useApiMutation({
    path: '/group/create',
    method: 'POST',
  });

  function handleCreateGroup(
    groupName: string,
    groupMembersEmails: Array<string>,
    groupType: string,
  ) {
    const data = {
      id: generateUUID(),
      groupName,
      groupMembersEmails,
      groupType,
    };

    createGroupMutation.mutate(data, {
      onSuccess: (data: any) => {
        navigate({ to: `/group/${data.id}/details` });
      },
      onError: (error: any) => {
        alert(error ?? 'Something went wrong');
      },
    });
  }

  const { mutate: deleteGroupMutation } = useMutation({
    mutationFn: async ({ groupID }: { groupID: string }) => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });

        return await deleteGroup(groupID, token);
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['user-groups'],
      });

      // remove the cached group data
      queryClient.removeQueries({
        queryKey: ['group-members', variables.groupID],
      });
    },
  });

  function handleDeleteGroup(groupID: string) {
    const confirmation = confirm(
      'Are you sure you want to delete this group? This action cannot be undone.',
    );
    if (!confirmation) return;
    deleteGroupMutation({ groupID });
    navigate({ to: '/groups/all' });

    // TODO - may also need to delete the cached data for this group (including cached members too!)
  }
  const { mutate: addMemberMutation } = useMutation({
    mutationFn: async ({
      groupID,
      memberEmail,
    }: {
      groupID: string;
      memberEmail: string;
    }) => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
      });

        return await createMembership({
          memberEmail: memberEmail,
          groupId: groupID,
        }, 
      token
    );
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['group-members', variables.groupID],
      });
    },
  });

  function handleAddMember(groupID: string, memberEmail: string) {
    // invoke mutation with a single variables object so types align with react-query
    addMemberMutation({ groupID, memberEmail });
  }

  const { mutate: removeUserMutation, isPending: isRemovingUser } = useMutation(
    {
      mutationFn: async ({
        groupID,
        memberID,
      }: {
        groupID: string;
        memberID: string;
      }) => {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
    });

          return await deleteMembership(groupID, memberID, token);
        } catch (error) {
          console.error(error);
        }
      },
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: ['group-members', variables.groupID],
        });
      },
    },
  );

  function handleRemoveUser(groupID: string, memberID: string) {
    removeUserMutation({ groupID, memberID });
  }

  const {
    data: groups,
    showLoading: isLoadingGroups,
    error,
  } = useApiQuery<Array<Group>>(
    ['user-groups', userId],
    '/membership/user/current/groups',
  );
  const {
    data: groupMembers,
    isLoading: groupMembersisLoading,
    error: groupMembersError,
  } = useQuery({
    queryKey: ['group-members', groupID],
    queryFn: async () => {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
  });

      return await getGroup(groupID!, token)
    },
    enabled: !!groupID, // prevent firing when groupID is undefined
    select: (group: FullGroup) => {
      const normalized = group.members.map((member) => ({
        id: member.user.id,
        username: member.user.username,
        email: member.user.email,
        joinDate: member.user.joinDate,
        profilePicture: member.user.profilePicture,
        role: member.role,
      }));

      // put ADMINs first
      normalized.sort((a, _) => (a.role === 'ADMIN' ? -1 : 1));
      return normalized;
    },
  });

  function checkAdmin(groupMembers: Array<GroupMember> | undefined): boolean {
    // based on the current user ID, this function checks if they are an admin in the group

    if (!groupMembers || !groupMembers.length || !currUserData) return false;

    const currUserMembership = groupMembers.find(
      (member) => member.id === currUserData.id,
    );

    if (!currUserMembership) return false;

    return currUserMembership.role === 'ADMIN';
  }

  return {
    handleCreateGroup,
    handleDeleteGroup,
    handleAddMember,
    handleRemoveUser,
    isRemovingUser,
    groups,
    isLoadingGroups,
    error,
    groupMembers,
    groupMembersisLoading,
    groupMembersError,
    checkAdmin,
  };
}
