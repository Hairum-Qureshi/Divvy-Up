export interface CreateGroupDto {
  id: string;
  groupName: string;
  groupMembersEmails: Array<string>;
  groupType: string;
}

export interface EditGroupDto {
  id: string;
  groupName?: string;
}

export interface DeleteGroupDto {
  id: string;
}
