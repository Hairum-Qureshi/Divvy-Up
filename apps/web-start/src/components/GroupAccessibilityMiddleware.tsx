import { useLocation, useParams } from '@tanstack/react-router';
import useGroups from '../hooks/useGroups';
import { useCurrentUser } from '../integrations/api';

export default function GroupAccessibilityMiddleware({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const { groupID } =
    pathname.includes('group') && pathname.includes('details')
      ? useParams({ from: '/group/$groupID/details' })
      : pathname.includes('group') && pathname.includes('members')
        ? useParams({ from: '/group/$groupID/members' })
        : pathname.includes('group') && pathname.includes('create-expense')
          ? useParams({ from: '/group/$groupID/create-expense' })
          : { groupID: null };

  const { data: currUserData } = useCurrentUser();

  const { groupMembers } = useGroups(groupID || '');
  const segments = pathname.split('/').filter(Boolean);

  if (
    (!segments.includes('group') && !segments.includes('details')) ||
    (!segments.includes('group') && !segments.includes('members')) ||
    (segments.includes('group') &&
      segments.includes('create') &&
      segments.includes('new'))
  ) {
    return children;
  }

  if (!groupMembers?.find((member) => member.id === currUserData?.id))
    return (
      <div className="w-full flex flex-col items-center justify-center mt-20">
        <h2 className="text-2xl mb-4">You are not a member of this group.</h2>
      </div>
    );
  return children;
}
