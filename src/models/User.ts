export const UserRoleList = ["ADMIN", "BUSINESS", "USER"];
export type UserRole = (typeof UserRoleList)[number];
//TODO: fix me
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
}

export interface UpdateCreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
}

export interface SignInObject {
  email: string;
  password: string;
}
