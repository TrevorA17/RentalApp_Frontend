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

export type ReportStatus = "OPEN" | "RESOLVED" | "DISMISSED";

export type UserStatus = "ACTIVE" | "SUSPENDED";

export type Inquiry = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingRentAmount: number;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  sender: {
    userId: string;
    fullName: string;
    email: string;
    role: Role;
  };
  recipient: {
    userId: string;
    fullName: string;
    email: string;
    role: Role;
  };
};

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

export type AgentRecommendation = {
  id: string;
  rating: number;
  comment: string;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  author: {
    userId: string;
    fullName: string;
    role: Role;
  };
};

export type ListingStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED" | "ARCHIVED" | "DISABLED";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Amenity = {
  id: string;
  name: string;
  slug: string;
};

export type MediaType = "IMAGE" | "VIDEO";

export type ListingMedia = {
  id: string;
  mediaType: MediaType;
  mediaUrl: string;
  caption?: string;
  displayOrder: number;
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
  thumbnailUrl?: string;
  media: ListingMedia[];
};

export type ListingSuggestion = {
  listing: ListingSummary;
  reason: string;
  score: number;
};

export type ListingDetail = ListingSummary & {
  description: string;
  thumbnailUrl?: string;
  poster: {
    userId: string;
    fullName: string;
    email: string;
    role: Role;
  };
};

export type Report = {
  id: string;
  reason: string;
  details?: string;
  status: ReportStatus;
  createdAt: string;
  reporter: {
    userId: string;
    fullName: string;
    email: string;
    role: Role;
  };
  reportedUser?: {
    userId: string;
    fullName: string;
    email: string;
    role: Role;
  };
  listing?: {
    listingId: string;
    title: string;
    city: string;
    area: string;
    ownerUserId: string;
    ownerFullName: string;
  };
};

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
};

export type AdminListing = {
  id: string;
  title: string;
  city: string;
  area: string;
  listingStatus: ListingStatus;
  approvalStatus: ApprovalStatus;
  updatedAt: string;
  owner: {
    userId: string;
    fullName: string;
    email: string;
  };
};

export type AdminAgentRecommendation = {
  id: string;
  rating: number;
  comment: string;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  agent: {
    userId: string;
    fullName: string;
    email: string;
  };
  author: {
    userId: string;
    fullName: string;
    email: string;
    role: Role;
  };
};

export type ModerationActionType =
  | "APPROVE"
  | "REJECT"
  | "FLAG"
  | "DISABLE"
  | "RESOLVE"
  | "STATUS_CHANGE";

export type ModerationTargetType = "LISTING" | "REPORT" | "AGENT_RECOMMENDATION";

export type AdminModerationAction = {
  id: string;
  targetType: ModerationTargetType;
  targetId: string;
  actionType: ModerationActionType;
  previousStatus?: string;
  newStatus?: string;
  reasonOrNote?: string;
  createdAt: string;
  actor: {
    userId: string;
    fullName: string;
    email: string;
  };
};
