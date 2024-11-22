export const UserRoleList = ["ADMIN", "BUSINESS", "USER"];
export type UserRole = (typeof UserRoleList)[number];

export interface UpdateCreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  phone?: string;
}
