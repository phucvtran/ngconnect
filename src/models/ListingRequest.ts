import { User } from "./User";

export interface ListingRequest {
  id: string;
  listingId: string | number;
  createdUserObj: User;
  createdUser: string;
  createdDate: string | number | Date;
  updatedDate: string | number | Date;
  conversations: Conversation[];
  reservationDates: string[];
}

export interface Conversation {
  id: string;
  listingRequestId: string;
  message: string;
  senderId: string;
  receiverId: string;
  createdDate: string | number | Date;
  updatedDate: string | number | Date;
}

export interface CreateListingRequestDto {
  listingId: string;
  message: string;
  reservationDates: string[];
}
