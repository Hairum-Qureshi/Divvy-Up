import { FaArrowLeft } from 'react-icons/fa';
import type { User } from '../interfaces';

type Props = {
  groupName: string;
  currentUsername: string;
  description: string;
  amount: string;
  splitEvenly: boolean;
  members: Array<User>;
  selectedMemberIds: Array<string>;
  perPersonAmount: number;
  isSubmitting: boolean;
  setDescription: (v: string) => void;
  setAmount: (v: string) => void;
  setSplitEvenly: (v: boolean) => void;
  toggleMember: (id: string) => void;
  onSubmit: () => Promise<void>;
};

export function CreateExpenseForm({
  groupName,
  currentUsername,
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
  onSubmit,
}: Props) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="font-semibold mb-4 mt-10">
        <button
          className="flex items-center mb-4 hover:cursor-pointer text-blue-600 hover:text-blue-800"
          onClick={() => window.history.back()}
        >
          <FaArrowLeft className="mr-2" />
          Go back to the "{groupName}" group details page
        </button>
        <h1 className="text-2xl">Add Expense to "{groupName}"</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="placeholder description"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
            <input
              className="w-full border rounded pl-7 pr-3 py-2"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
          >
            Created by
          </label>
          <input
            className="w-full border rounded px-3 py-2 bg-gray-100"
            value={currentUsername}
            disabled
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="split-evenly"
            type="checkbox"
            checked={splitEvenly}
            onChange={(e) => setSplitEvenly(e.target.checked)}
          />
          <label htmlFor="split-evenly" className="text-sm">
            Split evenly between group members
          </label>
        </div>

        {splitEvenly ? (
          <div>
            <p className="text-sm font-medium mb-1">
              Split between all group members
            </p>
            <p className="text-xs text-gray-500 mb-2">
              This expense will be divided evenly among all members in the
              group.
            </p>

            {perPersonAmount > 0 && members.length > 0 && (
              <p className="mt-2 text-sm">
                Each person will owe approximately{' '}
                <span className="font-semibold">
                  ${perPersonAmount.toFixed(2)}
                </span>
                .
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium mb-1">Members</p>
            <p className="text-xs text-gray-500 mb-2">
              Choose which members are included in this expense
            </p>

            <div className="border rounded p-3 max-h-48 overflow-y-auto space-y-1">
              {members.map((m) => (
                <label
                  key={m.id}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMemberIds.includes(m.id)}
                    onChange={() => toggleMember(m.id)}
                  />
                  <span>
                    {m.username}{' '}
                    <span className="text-xs text-gray-500">({m.email})</span>
                  </span>
                </label>
              ))}
            </div>

            {perPersonAmount > 0 && selectedMemberIds.length > 0 && (
              <p className="mt-2 text-sm">
                Each selected person will owe approximately{' '}
                <span className="font-semibold">
                  ${perPersonAmount.toFixed(2)}
                </span>
                .
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Creating...' : 'Create Expense'}
        </button>
      </form>
    </div>
  );
}
