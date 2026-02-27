import { useEffect, useState } from 'react';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useCurrentUser } from '../../../integrations/api';
import { getGroup } from '../../../integrations/fetcher';
import { useCreateExpense } from '../../../hooks/useCreateExpense';
import { CreateExpenseForm } from '../../../components/CreateExpenseForm';
import type { FullGroup } from '../../../interfaces';

export const Route = createFileRoute('/group/$groupID/create-expense')({
  component: CreateExpenseRouteComponent,
});

function CreateExpenseRouteComponent() {
  const { groupID } = useParams({ from: '/group/$groupID/create-expense' });
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) return <div>Loading user...</div>;
  if (isError || !user) return <div>Could not load current user.</div>;

  return (
    <CreateExpensePage
      groupId={groupID}
      currentUserId={user.id}
      currentUsername={user.username ?? ''}
    />
  );
}

type PageProps = {
  groupId: string;
  currentUserId: string;
  currentUsername: string;
};

export function CreateExpensePage({
  groupId,
  currentUserId,
  currentUsername,
}: PageProps) {
  const [group, setGroup] = useState<FullGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });
        const g = await getGroup(groupId, token);
        if (!alive) return;
        setGroup(g);
      } catch (e) {
        console.error(e);
        if (alive) setError('Failed to load group');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [groupId, getAccessTokenSilently]);

  const {
    description,
    amount,
    splitEvenly,
    members,
    selectedMemberIds,
    perPersonAmount,
    isSubmitting,
    setDescription,
    setAmount,
    setSplitEvenly,
    toggleMember,
    submitExpense,
  } = useCreateExpense({ group, groupId, currentUserId });

  if (loading) return <div>Loading group...</div>;
  if (error) return <div>{error}</div>;
  if (!group) return <div>Group not found.</div>;

  const handleSubmit = async () => {
    try {
      await submitExpense();
      alert('Expense created!');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to create expense.');
    }
  };

  return (
    <CreateExpenseForm
      groupName={group.groupName}
      currentUsername={currentUsername}
      description={description}
      amount={amount}
      splitEvenly={splitEvenly}
      members={members}
      selectedMemberIds={selectedMemberIds}
      perPersonAmount={perPersonAmount}
      isSubmitting={isSubmitting}
      setDescription={setDescription}
      setAmount={setAmount}
      setSplitEvenly={val => setSplitEvenly(val)}
      toggleMember={toggleMember}
      onSubmit={handleSubmit}
    />
  );
}
