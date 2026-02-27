import type { Expense } from '../interfaces';

type Props = {
  expenses?: Array<Expense>;
};

export default function GroupExpensesList({ expenses }: Props) {
  if (!expenses || expenses.length === 0) {
    return <p className="text-gray-500">No expenses for this group yet.</p>;
  }

  console.log(expenses);

  return (
    <ul className="space-y-2">
      {expenses.map((exp) => (
        <li
          key={exp.id}
          className="flex justify-between items-center border rounded-md px-4 py-2 bg-white shadow-sm"
        >
          <div>
            <p className="font-medium">{exp.description}</p>
            <p className="text-xs text-gray-500">
              {new Date(exp.dateAdded).toLocaleString()}
            </p>
          </div>

          <div className="font-semibold">
            {exp.amount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </li>
      ))}
    </ul>
  );
}
