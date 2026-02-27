import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useCurrentUser } from '../integrations/api';
import UserBadgesSection from '../components/BadgeSection';
import UserDebtsSection, {
  RecentTransactionsList,
  type RecentTransaction,
} from '../components/UserDebtsSection';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: currUserData, isLoading } = useCurrentUser();
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);

  const userId = currUserData?.id;

  if (isLoading || !userId) {
    return (
      <div className="w-full my-10 mx-20 text-xl">
        Loading user...
      </div>
    );
  }

  // callback that UserDebtsSection will call when a split is marked PAID
  function handleTransactionAdded(tx: RecentTransaction) {
    setRecentTransactions((prev) => [tx, ...prev]);
  }

  return (
    <div className="w-full">
      <div className="my-10 mx-20">
        <h1 className="text-3xl font-semibold">
          Welcome, {currUserData?.username}!
        </h1>

        {/* Top card: total balance + cycling through unpaid splits */}
        <UserDebtsSection
          userId={userId}
          onTransaction={handleTransactionAdded}
        />

        {/* Bottom row: recent transactions (left) + badges (right) */}
        <div className="w-full flex mt-6">
          <div className="w-1/2 pr-4">
            <RecentTransactionsList transactions={recentTransactions} />
          </div>

          <div className="w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Your Badges</h2>
            <UserBadgesSection userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}
