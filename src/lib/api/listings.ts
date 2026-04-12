import { apiRequest } from "@/lib/api/client";
import { ApiSuccessResponse, PaginatedResponse } from "@/types/api";
import { Amenity, ListingDetail, ListingSummary, UploadedListingMedia } from "@/types/domain";

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
  sort?: "PUBLISHED_AT_DESC" | "RENT_AMOUNT_ASC" | "RENT_AMOUNT_DESC" | "CREATED_AT_DESC";
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

export async function getAmenities() {
  const response = await apiRequest<ApiSuccessResponse<Amenity[]>>("/amenities", {
    method: "GET",
    cache: "no-store",
  });

  return response.data;
}

export async function createListing(payload: ListingUpsertPayload) {
  const response = await apiRequest<ApiSuccessResponse<ListingSummary>>("/listings", {
    method: "POST",
    auth: "required",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function uploadListingImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiRequest<ApiSuccessResponse<UploadedListingMedia>>("/listings/media/upload", {
    method: "POST",
    auth: "required",
    body: formData,
  });

  return response.data;
}

export async function updateListing(listingId: string, payload: ListingUpsertPayload) {
  const response = await apiRequest<ApiSuccessResponse<ListingSummary>>(`/listings/${listingId}`, {
    method: "PUT",
    auth: "required",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function publishListing(listingId: string) {
  const response = await apiRequest<ApiSuccessResponse<ListingSummary>>(`/listings/${listingId}/publish`, {
    method: "POST",
    auth: "required",
  });

  return response.data;
}

export async function getMyListings() {
  const response = await apiRequest<ApiSuccessResponse<ListingSummary[]>>("/my/listings", {
    method: "GET",
    auth: "required",
    cache: "no-store",
  });

  return response.data;
}

export async function getListingById(listingId: string, token?: string | null) {
  const response = await apiRequest<ApiSuccessResponse<ListingDetail>>(`/listings/${listingId}`, {
    method: "GET",
    auth: token ? "optional" : "none",
    token,
    cache: "no-store",
  });

  return response.data;
}

export async function searchListings(params: ListingSearchParams = {}) {
  const search = new URLSearchParams();

  if (params.city) search.set("city", params.city);
  if (params.area) search.set("area", params.area);
  if (params.minPrice !== undefined) search.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) search.set("maxPrice", String(params.maxPrice));
  if (params.bedrooms !== undefined) search.set("bedrooms", String(params.bedrooms));
  if (params.bathrooms !== undefined) search.set("bathrooms", String(params.bathrooms));
  if (params.houseType) search.set("houseType", params.houseType);
  if (params.furnished !== undefined) search.set("furnished", String(params.furnished));
  params.amenities?.forEach((amenity) => search.append("amenities", amenity));
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.size !== undefined) search.set("size", String(params.size));
  if (params.sort) search.set("sort", params.sort);

  const query = search.toString();
  const response = await apiRequest<ApiSuccessResponse<PaginatedResponse<ListingSummary>>>(`/listings${query ? `?${query}` : ""}`, {
    method: "GET",
    cache: "no-store",
  });

  return response.data;
}
