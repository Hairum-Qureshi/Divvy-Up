import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import useGroups from '../../../hooks/useGroups';
import { useCurrentUser } from '../../../integrations/api';

export const Route = createFileRoute('/group/create/new')({
  component: RouteComponent,
});

function RouteComponent() {
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState('');
  const [groupType, setGroupType] = useState('Trip');
  const { handleCreateGroup } = useGroups();
  const { data: currUserData } = useCurrentUser();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!groupName || !groupMembers) {
      return alert('Please fill in all required fields');
    }

    const groupMembersEmails: Array<string> = groupMembers
      .split(',')
      .map((member: string) => {
        return member.trim();
      })
      .filter((member) => {
        if (member && !member.includes('@')) {
          return alert(`Invalid email address: ${member}`);
        }
        if (member === currUserData?.email) {
          return alert(`You cannot add yourself`);
        }
        return member;
      })
      .map((member) => member.toLowerCase())
      .filter((member, index, self) => {
        return self.indexOf(member) === index;
      });

    if (groupMembersEmails.length === 1)
      return alert("Please enter at least 2 other members' email addresses.");

    handleCreateGroup(groupName, groupMembersEmails, groupType);
  }

  return (
    <div className="w-2/3 my-10 m-auto p-5 rounded-md">
      <h1 className="text-3xl font-semibold mb-5 mx-20 mt-5">
        Create a New Group
      </h1>
      <form className="space-y-5 mx-20">
        <div>
          <label
            className="block text-base font-medium mb-2 text-gray-600"
            htmlFor="groupName"
          >
            Group Name
          </label>
          <input
            type="text"
            id="groupName"
            className="border border-gray-300 p-2 rounded-md w-full outline-none"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div>
          <label
            className="block text-base font-medium mb-2 text-gray-600"
            htmlFor="groupMembers"
          >
            Group Members
          </label>
          <textarea
            id="groupMembers"
            className="border border-gray-300 p-2 rounded-md w-full outline-none resize-y min-h-20 h-20 max-h-32"
            placeholder="Enter Gmail addresses of members separated by commas"
            value={groupMembers}
            onChange={(e) => setGroupMembers(e.target.value)}
          />
          <p className="text-sm text-gray-400">
            Please enter at least 2 other members' email addresses. You can
            always add more members later.
          </p>
        </div>
        <div>
          <label
            className="block text-base font-medium mb-2 text-gray-600"
            htmlFor="groupType"
          >
            Group Type
          </label>
          <select
            id="groupType"
            className="border border-gray-300 p-2 rounded-md w-full outline-none mb-5"
            value={groupType}
            onChange={(e) => setGroupType(e.target.value)}
          >
            <option value="Trip">Trip</option>
            <option value="Roommates">Roommates</option>
            <option value="Event">Event</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="bg-green-600 w-1/2 text-white px-6 py-2 rounded-md hover:bg-green-700 hover:cursor-pointer"
            onClick={handleSubmit}
          >
            Create Group
          </button>
        </div>
      </form>
    </div>
  );
}
