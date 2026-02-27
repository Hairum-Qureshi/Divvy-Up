import { useNavigate } from '@tanstack/react-router';
import { useCurrentUser } from '../integrations/api';
import type { Group } from '../interfaces';

export default function GroupCard({ group }: { group: Group }) {
  // You can customize this once you have real “you owe / are owed” data.
  // For now, we’ll show a neutral status + created date.
  const createdDate = new Date(group.createdAt).toLocaleDateString();
  const navigate = useNavigate();
  const { data: currUserData } = useCurrentUser();

  return (
    <div className="p-4 bg-gray-50 shadow-md rounded-md">
      <div className="flex items-center">
        <h2 className="text-2xl font-semibold mr-auto">{group.groupName}</h2>
        <div className="ml-auto text-sm bg-gray-200 px-2 py-1 text-gray-600 rounded-full">
          Created: {createdDate}
        </div>
      </div>
      {group.createdBy === currUserData?.id ? (
        <div className="ml-auto text-base py-1 text-blue-600 rounded-full">
          <p>You are the admin for this group</p>
        </div>
      ) : (
        <div className="ml-auto text-base py-1 text-green-600 rounded-full">
          <p>You are a member of this group</p>
        </div>
      )}
      <div className="text-orange-500 px-2 font-semibold rounded-md bg-orange-100 inline-block mt-2">
        Group Type: {group.groupType}
      </div>
      <div className="space-x-3">
        <button
          className="mt-3 bg-blue-600 text-white py-1 px-4 rounded hover:cursor-pointer"
          onClick={() => navigate({ to: `/group/${group.id}/details` })}
        >
          View Details
        </button>
        <button
          className="mt-3 bg-green-600 text-white py-1 px-4 rounded hover:cursor-pointer"
          onClick={() => navigate({ to: `/group/${group.id}/members` })}
        >
          View Members
        </button>
      </div>
    </div>
  );
}
