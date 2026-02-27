import { createFileRoute } from '@tanstack/react-router';
import LoginButton from '../components/LoginButton';

export const Route = createFileRoute('/join')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full p-10">
      <div className="flex items-center justify-center flex-col gap-4 mt-25">
        <h1 className="text-5xl font-bold">Join DivvyUp Today!</h1>
        <h3 className="text-xl font-semibold text-slate-400">
          Seamless Expense Splitting For Everyone
        </h3>
        <LoginButton />
      </div>
    </div>
  );
}
