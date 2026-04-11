import { apiRequest } from "@/lib/api/client";
import { ApiSuccessResponse } from "@/types/api";
import { Amenity, ListingDetail, ListingSummary } from "@/types/domain";

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

export async function createListing(token: string, payload: ListingUpsertPayload) {
  const response = await apiRequest<ApiSuccessResponse<ListingSummary>>("/listings", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateListing(token: string, listingId: string, payload: ListingUpsertPayload) {
  const response = await apiRequest<ApiSuccessResponse<ListingSummary>>(`/listings/${listingId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function publishListing(token: string, listingId: string) {
  const response = await apiRequest<ApiSuccessResponse<ListingSummary>>(`/listings/${listingId}/publish`, {
    method: "POST",
    token,
  });

  return response.data;
}

export async function getMyListings(token: string) {
  const response = await apiRequest<ApiSuccessResponse<ListingSummary[]>>("/my/listings", {
    method: "GET",
    token,
    cache: "no-store",
  });

  return response.data;
}

export async function getListingById(listingId: string, token?: string | null) {
  const response = await apiRequest<ApiSuccessResponse<ListingDetail>>(`/listings/${listingId}`, {
    method: "GET",
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

  const query = search.toString();
  const response = await apiRequest<ApiSuccessResponse<ListingSummary[]>>(`/listings${query ? `?${query}` : ""}`, {
    method: "GET",
    cache: "no-store",
  });

  return response.data;
}
