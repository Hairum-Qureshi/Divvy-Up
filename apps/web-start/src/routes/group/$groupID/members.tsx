import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import useEmail from '../../../hooks/useEmail';
import MemberCard from '../../../components/MemberCard';
import useGroups from '../../../hooks/useGroups';
import { useCurrentUser } from '../../../integrations/api';
import type { FullGroup } from '../../../interfaces';

export const Route = createFileRoute('/group/$groupID/members')({
  component: RouteComponent,
});

function RouteComponent() {
  const { sendEmailMutation } = useEmail();
  const [userEmail, setUserEmail] = useState('');
  const { groupID } = useParams({ from: '/group/$groupID/members' });
  const [groupData, setGroupData] = useState<FullGroup | null>(null);

  const {
    handleAddMember,
    handleDeleteGroup,
    groupMembers,
    groupMembersisLoading,
    groupMembersError,
    checkAdmin,
    groups
  } = useGroups(groupID);

  useEffect(() => {
    setGroupData((groups?.filter((g) => g.id === groupID)[0] as FullGroup | null) || null);
  }, [groupID]);

  const navigate = useNavigate();
  const { data: currUserData } = useCurrentUser();
  function handleSubmit(groupID: string, userEmail: string) {
    if (!userEmail.trim()) return alert('Please enter an email address');

    // check to make sure email is valid
    if (!/\S+@\S+\.\S+/.test(userEmail)) {
      return alert('Please enter a valid email address');
    }

    sendEmailMutation({
      groupID,
      toEmail: userEmail,
      adminName: currUserData?.username || '',
    });

    handleAddMember(groupID, userEmail.toLowerCase());

    setUserEmail('');
  }

  return (
    <div className="w-2/3 my-10 m-auto p-5 rounded-md">
      <button
        className="flex items-center mb-4 hover:cursor-pointer font-semibold text-blue-600 hover:text-blue-800"
        onClick={() => navigate({ to: `/group/${groupID}/details` })}
      >
        <FaArrowLeft className="mr-2" />
        Go back to the "{groupData?.groupName}" group details page
      </button>
      <h1 className="text-3xl font-semibold mb-5">
       "{groupData?.groupName}" Group Members ({groupMembers?.length || 0})
      </h1>
      <div className="shadow-md shadow-gray-300">
        {groupMembersError ? (
          <p className="p-3 text-red-600">
            There was an error loading group members
          </p>
        ) : groupMembersisLoading ? (
          <p className="p-3">Loading...</p>
        ) : groupMembers?.length ? (
          groupMembers.map((member) => (
            <MemberCard
              key={member.id}
              groupID={groupID}
              memberID={member.id}
              username={member.username}
              userEmail={member.email}
              userProfilePicture={member.profilePicture}
              isAdmin={member.role === 'ADMIN'}
              isCurrentUserAdmin={checkAdmin(groupMembers)}
              adminUID={member.id}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm p-4">No members found</p>
        )}
      </div>
      {groupMembers?.length === 1 && checkAdmin(groupMembers) && (
        <div>
          <h1 className="text-xl font-semibold mt-10 mb-5 text-red-600">
            Delete this group?
          </h1>
          <div className="border border-red-500 bg-red-100 rounded-md p-3">
            <p className="text-red-600 my-2">
              You're currently the only user left in this group. Would you like
              to delete this group? <br /> Please note that this cannot be
              undone!
            </p>
            <div className="flex">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 hover:cursor-pointer"
                onClick={() => {
                  handleDeleteGroup(groupID);
                  navigate({ to: '/groups/all' });
                }}
              >
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}
      {checkAdmin(groupMembers) && (
        <div>
          <h1 className="text-xl font-semibold mt-10 mb-5">Add Member</h1>
          <div className="shadow-md shadow-gray-300 p-3">
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full p-2 border outline-none border-slate-300 rounded-md mb-2 lowercase"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              autoCorrect="off"
              autoCapitalize="off"
            />
            <p className="text-sm mb-2 text-slate-500">
              Please enter one email address at a time.
            </p>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 hover:cursor-pointer"
              onClick={() => handleSubmit(groupID, userEmail)}
            >
              Add Member
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
