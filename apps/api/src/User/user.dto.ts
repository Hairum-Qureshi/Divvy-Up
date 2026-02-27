export interface CreateUserDto {
  id?: string;
  username: string;
  email: string;
  password: string;
}

export interface EditUserDto {
  id: string;
  username?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
}

export interface DeleteUserDto {
  id: string;
}
