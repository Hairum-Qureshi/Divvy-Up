import { useMemo, useState } from 'react';
import type { ExpenseSplit } from '../interfaces';
import useUnpaidSplits from '../hooks/useUnpaidSplits';

export type RecentTransaction = {
  description: string;
  amount: number;
  date: string; // ISO string
};

type Props = {
  userId?: string;
  // 🔹 optional callback => lets the parent (dashboard) store recent tx
  onTransaction?: (tx: RecentTransaction) => void;
};

export default function UserDebtsSection({ userId, onTransaction }: Props) {
  const { data: splits = [], isLoading, isError, markPaid } = useUnpaidSplits(userId);
  const [index, setIndex] = useState(0);

  const currentSplit: ExpenseSplit | undefined = useMemo(
    () => (splits.length > 0 ? splits[index] : undefined),
    [splits, index],
  );

  if (!userId) {
    return (
      <div className="w-full my-10 mx-20 text-xl">
        Loading user...
      </div>
    );
  }

  const hasSplits = splits.length > 0 && !!currentSplit;

  function handleNext() {
    if (!hasSplits) return;
    setIndex((prev) => (prev + 1 < splits.length ? prev + 1 : 0));
  }

  async function handleMarkPaid() {
    if (!currentSplit) return;

    try {
      await markPaid(currentSplit);

      // tell parent "a transaction happened"
      onTransaction?.({
        description: currentSplit.expense?.description ?? 'Expense',
        amount: currentSplit.amountOwed,
        date: new Date().toISOString(),
      });

      // reset index if needed
      if (index >= splits.length - 1) {
        setIndex(0);
      }
    } catch (err) {
      console.error('Failed to mark split as PAID', err);
    }
  }

  return (
    <DebtsCard
      isLoading={isLoading}
      isError={isError}
      currentSplit={currentSplit}
      hasSplits={hasSplits}
      onNext={handleNext}
      onMarkPaid={handleMarkPaid}
    />
  );
}

/* --------------------- DebtsCard --------------------- */

type DebtsCardProps = {
  isLoading: boolean;
  isError: boolean;
  currentSplit?: ExpenseSplit;
  hasSplits: boolean;
  onNext: () => void;
  onMarkPaid: () => void;
};

function DebtsCard({
  isLoading,
  isError,
  currentSplit,
  hasSplits,
  onNext,
  onMarkPaid,
}: DebtsCardProps) {
  return (
    <div className="my-5 rounded-md w-full p-8 bg-slate-100 flex shadow-md">
      <div className="mr-auto">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p className="text-red-600">Failed to load expenses.</p>
        ) : !hasSplits || !currentSplit ? (
          <>
            <p>TOTAL BALANCE DUE</p>
            <h2 className="text-4xl font-semibold my-2">
              You Owe <span className="font-bold text-green-700">$0.00</span>
            </h2>
            <p>No unpaid expenses</p>
          </>
        ) : (
          <>
            <p>TOTAL BALANCE DUE</p>
            <h2 className="text-4xl font-semibold my-2">
              You Owe{' '}
              <span className="font-bold text-green-700">
                ${currentSplit.amountOwed.toFixed(2)}
              </span>
            </h2>
            <p>
              to{' '}
              <span className="font-semibold">
                {currentSplit.expense?.paidBy?.username ?? 'Unknown'}
              </span>{' '}
              for{' '}
              <span className="font-semibold">
                {currentSplit.expense?.description ?? 'Expense'}
              </span>{' '}
              on{' '}
              <span className="font-semibold">
                {currentSplit.expense?.dateAdded
                  ? new Date(currentSplit.expense.dateAdded).toLocaleDateString()
                  : 'N/A'}
              </span>
            </p>
          </>
        )}
      </div>

      <div className="ml-auto flex flex-col">
        <button
          onClick={onNext}
          className="bg-green-600 text-white px-4 py-2 rounded-md mb-2 hover:bg-green-700 hover:cursor-pointer disabled:opacity-50"
          disabled={!hasSplits}
        >
          Next Expense
        </button>

        <button
          onClick={onMarkPaid}
          className="bg-white text-green-600 border border-green-600 px-4 py-2 rounded-md hover:bg-green-100 hover:cursor-pointer disabled:opacity-50"
          disabled={!hasSplits}
        >
          Mark as Paid
        </button>
      </div>
    </div>
  );
}

/* --------------- RecentTransactionsList ---------------- */

type RecentTransactionsListProps = {
  transactions: RecentTransaction[];
};

export function RecentTransactionsList({ transactions }: RecentTransactionsListProps) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-sm text-gray-500">No recent transactions yet.</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((tx, idx) => (
            <li
              key={idx}
              className="border rounded-md p-2 bg-white shadow-sm text-sm flex justify-between"
            >
              <div>
                <div className="font-medium">{tx.description}</div>
                <div className="text-xs text-gray-500">
                  {new Date(tx.date).toLocaleString()}
                </div>
              </div>
              <div className="font-semibold">
                ${Number(tx.amount).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
