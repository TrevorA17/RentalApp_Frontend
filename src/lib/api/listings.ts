import client from "@/lib/api/client";
import type { ApiSuccessResponse, PaginatedResponse } from "@/types/api";
import type {
  Amenity,
  ListingDetail,
  ListingSummary,
  UploadedListingMedia,
} from "@/types/domain";

export type ListingSearchParams = {
  city?: string;
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  houseType?: string;
  furnished?: boolean;
  amenities?: string[];
  page?: number;
  size?: number;
  sort?:
    | "PUBLISHED_AT_DESC"
    | "RENT_AMOUNT_ASC"
    | "RENT_AMOUNT_DESC"
    | "CREATED_AT_DESC";
};

export type ListingUpsertPayload = {
  title: string;
  description: string;
  rentAmount: number;
  depositAmount?: number;
  agentFeeAmount?: number;
  city: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  houseType: string;
  furnished: boolean;
  availabilityStatus: string;
  amenityIds: string[];
  media: Array<{
    mediaType: string;
    mediaUrl: string;
    caption?: string;
  }>;
};

const authed = { meta: { auth: "required" as const } };

export async function getAmenities(): Promise<Amenity[]> {
  const res = await client.get<ApiSuccessResponse<Amenity[]>>("/amenities");
  return res.data.data;
}

export async function createListing(
  payload: ListingUpsertPayload,
): Promise<ListingSummary> {
  const res = await client.post<ApiSuccessResponse<ListingSummary>>(
    "/listings",
    payload,
    authed,
  );
  return res.data.data;
}

export async function uploadListingImage(
  file: File,
): Promise<UploadedListingMedia> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await client.post<ApiSuccessResponse<UploadedListingMedia>>(
    "/listings/media/upload",
    formData,
    authed,
  );
  return res.data.data;
}

export async function updateListing(
  listingId: string,
  payload: ListingUpsertPayload,
): Promise<ListingSummary> {
  const res = await client.put<ApiSuccessResponse<ListingSummary>>(
    `/listings/${listingId}`,
    payload,
    authed,
  );
  return res.data.data;
}

export async function publishListing(
  listingId: string,
): Promise<ListingSummary> {
  const res = await client.post<ApiSuccessResponse<ListingSummary>>(
    `/listings/${listingId}/publish`,
    undefined,
    authed,
  );
  return res.data.data;
}

export async function getMyListings(): Promise<ListingSummary[]> {
  const res = await client.get<ApiSuccessResponse<ListingSummary[]>>(
    "/my/listings",
    authed,
  );
  return res.data.data;
}

export async function getListingById(
  listingId: string,
  token?: string | null,
): Promise<ListingDetail> {
  const config = token
    ? {
        meta: { auth: "optional" as const },
        headers: { Authorization: `Bearer ${token}` },
      }
    : undefined;
  const res = await client.get<ApiSuccessResponse<ListingDetail>>(
    `/listings/${listingId}`,
    config,
  );
  return res.data.data;
}

export async function searchListings(
  params: ListingSearchParams = {},
): Promise<PaginatedResponse<ListingSummary>> {
  const query: Record<string, string | string[]> = {};

  if (params.city) query.city = params.city;
  if (params.area) query.area = params.area;
  if (params.minPrice !== undefined) query.minPrice = String(params.minPrice);
  if (params.maxPrice !== undefined) query.maxPrice = String(params.maxPrice);
  if (params.bedrooms !== undefined) query.bedrooms = String(params.bedrooms);
  if (params.bathrooms !== undefined)
    query.bathrooms = String(params.bathrooms);
  if (params.houseType) query.houseType = params.houseType;
  if (params.furnished !== undefined)
    query.furnished = String(params.furnished);
  if (params.amenities?.length) query.amenities = params.amenities;
  if (params.page !== undefined) query.page = String(params.page);
  if (params.size !== undefined) query.size = String(params.size);
  if (params.sort) query.sort = params.sort;

  const res = await client.get<
    ApiSuccessResponse<PaginatedResponse<ListingSummary>>
  >("/listings", {
    params: query,
    paramsSerializer: { indexes: null }, // repeat amenities=a&amenities=b
  });
  return res.data.data;
}
