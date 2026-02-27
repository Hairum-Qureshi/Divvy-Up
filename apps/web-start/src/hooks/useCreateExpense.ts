import { useState, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { FullGroup, User, CreateExpenseDto } from '../interfaces';
import { createExpense } from '../integrations/fetcher';

export function useCreateExpense(opts: {
  group: FullGroup | null;
  groupId: string;
  currentUserId: string;
}) {
  const { group, groupId, currentUserId } = opts;
  const { getAccessTokenSilently } = useAuth0();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitEvenly, setSplitEvenly] = useState(true);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const members: User[] = useMemo(
    () => (group?.members ?? []).map((m: any) => m.user),
    [group],
  );

  useMemo(() => {
    if (!group) return;
    const allMemberIds = group.members?.map((m: any) => m.user.id) ?? [];
    setSelectedMemberIds(allMemberIds);
  }, [group]);

  const numericAmount = Number(amount) || 0;
  const numMembersForCalc = splitEvenly ? members.length : selectedMemberIds.length;
  const perPersonAmount =
    numericAmount > 0 && numMembersForCalc > 0
      ? numericAmount / numMembersForCalc
      : 0;

  const toggleMember = (id: string) => {
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id],
    );
  };

  const submitExpense = async () => {
    if (!numericAmount || numericAmount <= 0) {
      throw new Error('Please enter a valid amount.');
    }
    if (!splitEvenly && selectedMemberIds.length === 0) {
      throw new Error('Please select at least one member.');
    }

    const payload: CreateExpenseDto = {
      amount: numericAmount,
      description,
      groupId,
      paidById: currentUserId,
      splitEvenly,
      memberIds: selectedMemberIds,
    };

    //debug line
    console.log('Submitting expense payload →', payload); 

    setIsSubmitting(true);
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      await createExpense(payload, token); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    description,
    amount,
    splitEvenly,
    selectedMemberIds,
    members,
    numericAmount,
    perPersonAmount,
    isSubmitting,
    setDescription,
    setAmount,
    setSplitEvenly,
    setSelectedMemberIds,
    toggleMember,
    submitExpense,
  };
}
