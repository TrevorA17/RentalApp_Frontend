export type Role = "RENTER" | "AGENT" | "LANDLORD" | "ADMIN";

export type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED";

export type HouseType =
  | "APARTMENT"
  | "BEDSITTER"
  | "STUDIO"
  | "MAISONETTE"
  | "BUNGALOW"
  | "HOUSE"
  | "TOWNHOUSE";

export type AvailabilityStatus = "AVAILABLE_NOW" | "AVAILABLE_SOON" | "OCCUPIED";

export type InquiryStatus = "NEW" | "CONTACTED" | "CLOSED";

export type Profile = {
  userId: string;
  fullName: string;
  email?: string;
  role?: Role;
  phoneNumber?: string;
  bio?: string;
  profilePhotoUrl?: string;
  city?: string;
  serviceAreas?: string[];
  companyName?: string;
  feeStructure?: string;
  verificationStatus?: VerificationStatus;
};

export type ListingStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED" | "ARCHIVED" | "DISABLED";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Amenity = {
  id: string;
  name: string;
  slug: string;
};

export type ListingCard = {
  id: string;
  title: string;
  rentAmount: number;
  city: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  houseType: HouseType;
  furnished: boolean;
  availabilityStatus: AvailabilityStatus;
  thumbnailUrl?: string;
};

export type ListingSummary = {
  id: string;
  title: string;
  rentAmount: number;
  depositAmount?: number;
  agentFeeAmount?: number;
  city: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  houseType: HouseType;
  furnished: boolean;
  availabilityStatus: AvailabilityStatus;
  listingStatus: ListingStatus;
  approvalStatus: ApprovalStatus;
  ownerType: Role;
  amenities: Amenity[];
};

export type ListingDetail = ListingSummary & {
  description: string;
  poster: {
    userId: string;
    fullName: string;
    email: string;
    role: Role;
  };
};
