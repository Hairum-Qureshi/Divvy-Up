import useBadges from '../hooks/useBadges';

type Props = {
  userId?: string;
};

export default function UserBadgesSection({ userId }: Props) {
  const { data: badges, isLoading, isError } = useBadges(userId);

  if (!userId) return null;

  if (isLoading) return <p>Loading badges...</p>;
  if (isError) return <p className="text-red-600">Failed to load badges.</p>;

  return (
    <div className="w-full mt-10">

      {(!badges || badges.length === 0) && (
        <p className="text-gray-500">You haven't earned any badges yet.</p>
      )}

      <div className="space-y-4">
        {badges?.map((badge) => (
          <div
            key={badge.id}
            className="p-4 bg-white rounded-md shadow-md flex items-center gap-3"
          >
            <img
              src={badge.iconUrl}
              alt={badge.name}
              className="w-12 h-12 rounded-full"
            />

            <div>
              <p className="font-semibold text-lg">{badge.name}</p>
              {badge.description && (
                <p className="text-sm text-gray-600">{badge.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
