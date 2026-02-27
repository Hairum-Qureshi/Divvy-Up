import useGroups from '../hooks/useGroups';
import { useCurrentUser } from '../integrations/api';
import type { MemberCardProps } from '../interfaces';

export default function MemberCard({
  groupID,
  memberID,
  username,
  userEmail,
  userProfilePicture,
  isAdmin,
  isCurrentUserAdmin,
  adminUID,
}: MemberCardProps) {
  const { handleRemoveUser, isRemovingUser } = useGroups(groupID);
  const { data: currUserData } = useCurrentUser();

  const isCurrUser = currUserData?.id === memberID;

  return (
    <div className="p-4 flex items-center border border-slate-200">
      <div>
        <img
          src={userProfilePicture}
          alt="User Avatar"
          className="w-11 h-11 rounded-full mr-4"
          referrerPolicy="no-referrer"
        />
      </div>
      <div>
        <h2 className="text-lg font-semibold">{username}</h2>
        <p className="text-gray-500 text-sm">{userEmail}</p>
      </div>
      <div className="ml-auto flex items-center justify-center space-x-6">
        <div className="flex flex-col items-center">
          <span
            className={`${isAdmin ? 'bg-blue-100' : 'bg-green-100'} text-slate-800 text-xs font-semibold px-2.5 py-0.5 rounded`}
          >
            {isAdmin ? 'Admin' : 'Member'}
          </span>

          {isRemovingUser ? (
            <p className="mt-2 text-sm">
              {isCurrUser ? 'Leaving group...' : 'Removing user...'}
            </p>
          ) : (
            <>
              {isCurrUser && !isAdmin && (
                <button
                  className="text-red-600 mt-2 text-sm hover:cursor-pointer hover:underline"
                  onClick={() => handleRemoveUser(groupID, memberID)}
                  disabled={isRemovingUser}
                >
                  Leave Group
                </button>
              )}
              {isCurrentUserAdmin && adminUID !== currUserData?.id && (
                <button
                  className="text-red-600 mt-2 text-sm hover:cursor-pointer hover:underline"
                  onClick={() => handleRemoveUser(groupID, memberID)}
                  disabled={isRemovingUser}
                >
                  Remove User
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
