import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { FaPlus, FaTrashAlt, FaUsers } from 'react-icons/fa';
import useGroups from '../../../hooks/useGroups';
import useGroupExpenses from '../../../hooks/useGroupExpenses.ts';
import { getGroup } from '../../../integrations/fetcher';
import ExpensesForGroup from '../../../components/ExpensesForGroup.tsx';
import { useCurrentUser } from '../../../integrations/api.ts';
import type { Group } from '../../../interfaces';

export const Route = createFileRoute('/group/$groupID/details')({
  component: RouteComponent,
});

function RouteComponent() {
  const { groupID } = useParams({ from: '/group/$groupID/details' });
  const { handleDeleteGroup } = useGroups(groupID);
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  const { data: currUserData } = useCurrentUser();

  useEffect(() => {
    const fetchGroup = async () => {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      const groupData = await getGroup(groupID, token);
      setGroup(groupData);
    };

    fetchGroup();
  }, [groupID]);

  const {
    data: expenses,
    isLoading: expensesLoading,
    isError,
    error: expensesError,
  } = useGroupExpenses(groupID);

  if (expensesLoading) {
    return <div>Loading expenses...</div>;
  }

  if (isError) {
    return <div>Error loading expenses: {expensesError.message}</div>;
  }

  return (
    <div className="w-2/3 my-10 m-auto p-5 rounded-md">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">{group?.groupName}</h1>
        <p className="text-gray-500 text-xl">
          Created on {new Date(group?.createdAt as string).toLocaleDateString()}{' '}
          by {group?.creator?.username} • {group?.groupType}
        </p>
      </div>
      <div className="w-full border-2 border-gray-400 bg-slate-100 p-3 rounded-md mb-5">
        <div className="space-x-3 flex font-semibold">
          <button
            onClick={() => navigate({ to: `/group/${groupID}/create-expense` })}
            className="px-4 py-2 bg-green-700 flex items-center justify-center text-white text-base rounded-md hover:cursor-pointer"
          >
            <FaPlus className="mr-2" />
            <span>Create Expense</span>
          </button>
          <button
            onClick={() => navigate({ to: `/group/${groupID}/members` })}
            className="px-4 py-2 bg-slate-50 flex items-center justify-center border border-black rounded-md hover:cursor-pointer"
          >
            <FaUsers className="mr-2 text-xl" />
            View Members
          </button>
          {group?.creator?.id === currUserData?.id && (
            <button
              onClick={() => handleDeleteGroup(groupID)}
              className="px-4 py-2 bg-red-100 text-red-700 border border-red-600 flex items-center justify-center rounded-md hover:cursor-pointer hover:bg-red-200 hover:transition-colors ml-auto hover:text-red-800"
            >
              <FaTrashAlt className="mr-2" />
              Delete Group
            </button>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">Expenses</h2>

      <ExpensesForGroup expenses={expenses} />
    </div>
  );
}
