import { User } from "./User";

export const ListingStatusList = ["ACTIVE", "IN_PROGRESS", "COMPLETED"];
export type ListingStatus = (typeof ListingStatusList)[number];
export interface ListingDetails {
  id: string;
  title: string;
  categoryId: number;
  price: number;
  description: string;
  status: ListingStatus;
  createdDate: string | number | Date;
  city?: string;
  state?: string;
  zipcode?: string;

  job?: {
    id: number;
    listingId: number;
    minRate: number;
    maxRate?: number;
    startDate: string;
    endDate?: string;
  };

  user?: User;
}

export interface UpdateCreateListingDto {
  title: string;
  description: string;
  price: number;
  categoryId: number;
  city: string;
  state: string;
  zipcode: string;
}
export interface UpdateCreateJobListingDto extends UpdateCreateListingDto {
  minRate: number;
  startDate: Date;
  maxRate?: number;
  endDate?: Date;
}
