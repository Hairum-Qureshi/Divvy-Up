import { createFileRoute } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useCurrentUser } from '../integrations/api';
import useUser from '../hooks/useUser';
import useGroups from '../hooks/useGroups';
import GroupCard from '../components/GroupCard';
import UserBadgesSection from '../components/BadgeSection';
import type { Group } from '../interfaces';

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: currUserData, isLoading: userLoading } = useCurrentUser();
  const { user } = useAuth0();
  const { handleEditUserSettings, deleteProfile } = useUser();
  const { groups, isLoadingGroups, error } = useGroups();

  return (
    <div className="w-2/3 my-10 m-auto p-5 rounded-md">
      <h1 className="text-3xl font-semibold mr-auto">Your Profile</h1>
      {currUserData?.email !== user?.email && (
        <div className="mb-10 mt-5 bg-red-200 border border-red-500 text-red-800 rounded-md p-2">
          Hello, <span className="font-semibold">{currUserData?.username}</span>
          . To continue using group features, you need to update your account
          details by selecting the{' '}
          <span className="font-semibold">Update User Settings</span> button
          below. This will replace your current profile information with the
          data linked to your Google account. The change is permanent and cannot
          be reverted. Once completed, this notice will no longer appear.
          <br />
          <br />
          Right now, your generated email is:{' '}
          <span className="font-semibold">{currUserData?.email}</span>, and this
          email cannot be used to add you to groups until it is replaced with
          your Google-linked Gmail address. After the update, your generated
          email will match the one shown below.
        </div>
      )}
      <div className="flex flex-col mt-10 shadow-md shadow-gray-300 p-5 rounded-md">
        <div className="flex items-center justify-center">
          <div className="w-32 h-32 mr-5">
            <img
              src={user?.picture}
              className="rounded-full w-32 h-32 object-cover"
              alt="User profile picture"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="w-3/4">
            <div className="flex flex-col justify-center">
              <input
                type="text"
                placeholder="Username"
                value={user?.name}
                className="border border-gray-300 p-2 rounded-md w-full outline-none mb-3 disabled:bg-gray-100"
                disabled={true}
              />
            </div>
            <div className="flex flex-col justify-center">
              <input
                type="email"
                placeholder="Email"
                value={`${user?.email}`}
                className="border border-gray-300 p-2 rounded-md w-full outline-none mb-3 disabled:bg-gray-100"
                disabled={true}
              />
            </div>
            {currUserData?.email !== user?.email && (
              <div className="flex">
                <button
                  className="ml-auto bg-green-500 p-2 w-1/3 text-white rounded-md hover:bg-green-600 transition-colors hover:cursor-pointer"
                  onClick={() =>
                    handleEditUserSettings(
                      currUserData?.id,
                      user?.name,
                      user?.picture,
                      user?.email,
                    )
                  }
                >
                  Update User Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <UserBadgesSection userId={currUserData?.id}/>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-5">Your Groups</h2>
        {userLoading || isLoadingGroups ? (
          <p>Loading your groups...</p>
        ) : error ? (
          <p className="text-red-600">Error loading groups: {error.message}</p>
        ) : groups && groups.length > 0 ? (
          <div className="space-y-4">
            {groups.map((group: Group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You are not a member of any groups.</p>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-semibold mt-10 mb-5 text-red-600">
          Delete Account?
        </h1>
        <div className="border border-red-500 bg-red-100 rounded-md p-3">
          <p className="text-red-600 my-2">
            Are you sure you want to delete your account? <br /> Please note
            that this cannot be undone!
          </p>
          <div className="flex">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 hover:cursor-pointer"
              onClick={() => deleteProfile()}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
