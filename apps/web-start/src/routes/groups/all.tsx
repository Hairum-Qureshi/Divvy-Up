import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import GroupCard from '../../components/GroupCard';
import useGroups from '../../hooks/useGroups';
import type { Group } from '../../interfaces';

export const Route = createFileRoute('/groups/all')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { groups, isLoadingGroups, groupMembersError } = useGroups();

  const [searchPhrase, setSearchPhrase] = useState('');

  const filteredGroups: Array<Group> | undefined = useMemo(() => {
    if (!groups) return undefined;
    return [...groups]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .filter((group: Group) => {
        if (searchPhrase.startsWith('[') && searchPhrase.endsWith(']')) {
          return (
            group.groupType.toLowerCase() ===
            searchPhrase.toLowerCase().replace('[', '').replace(']', '')
          );
        } else {
          return group.groupName
            .toLowerCase()
            .includes(searchPhrase.toLowerCase());
        }
      });
  }, [groups, searchPhrase]); // will only run when either changes

  if (isLoadingGroups) {
    return (
      <div className="mx-20 my-10">
        <h1 className="text-3xl font-semibold mb-5">Your Groups</h1>
        <p>Loading groups...</p>
      </div>
    );
  }

  if (groupMembersError) {
    return (
      <div className="mx-20 my-10">
        <h1 className="text-3xl font-semibold mb-5">Your Groups</h1>
        <p className="text-red-600">Error loading groups: {groupMembersError.message}</p>
      </div>
    );
  }

  const hasGroups = groups && groups.length > 0;

  return (
    <div className="mx-20 my-10">
      <div className="flex items-center my-4">
        <h1 className="text-3xl font-semibold mr-auto">Your Groups</h1>
        <input
          type="text"
          placeholder="Search by title or filter with [trip], [other], etc."
          className="w-1/2 p-1.5 outline-none rounded-sm border-2 border-green-600"
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
        />
        <button
          className="bg-[#3BB273] text-white p-3 rounded-md ml-auto hover:cursor-pointer"
          onClick={() => navigate({ to: '/group/create/new' })}
        >
          Create New Group
        </button>
      </div>

      {!hasGroups ? (
        <p className="text-gray-500 my-15 text-center col-span-full text-xl font-semibold">
          You are not a member of any groups yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
          {filteredGroups?.length ? (
            filteredGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))
          ) : (
            <div className="my-15 text-center col-span-full text-xl font-semibold">
              No groups match your search
            </div>
          )}
        </div>
      )}
    </div>
  );
}
