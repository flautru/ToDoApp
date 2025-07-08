export interface User {
  username: string;
  password: string;
  role: string;
}

export interface UserDto {
  id?: number;
  username: string;
  role: string;
}
