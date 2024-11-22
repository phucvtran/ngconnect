export const ListingStatusList = ["ACTIVE", "IN_PROGRESS", "COMPLETED"];
export type ListingStatus = (typeof ListingStatusList)[number];
export interface ListingDetails {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  createDate: Date;
  status: ListingStatus;
  city?: string;
  state?: string;
  zipcode?: string;
}
