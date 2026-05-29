import { apiRequest } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/types/api";
import type {
  AvailabilityStatus,
  HouseType,
  InterpretedListingSearch,
} from "@/types/domain";

export type EnhanceListingDescriptionPayload = {
  title: string;
  description: string;
  city: string;
  area: string;
  houseType: HouseType;
  bedrooms: number;
  bathrooms: number;
  availabilityStatus: AvailabilityStatus;
  furnished: boolean;
  rentAmount: number;
  amenities: string[];
};

export type EnhanceListingDescriptionResult = {
  enhancedDescription: string;
  suggestions: string[];
  provider: string;
};

export async function enhanceListingDescription(
  payload: EnhanceListingDescriptionPayload,
) {
  const response = await apiRequest<
    ApiSuccessResponse<EnhanceListingDescriptionResult>
  >("/ai/listings/description-enhance", {
    method: "POST",
    auth: "required",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function interpretListingSearch(query: string) {
  const response = await apiRequest<
    ApiSuccessResponse<InterpretedListingSearch>
  >("/ai/search/interpret", {
    method: "POST",
    body: JSON.stringify({ query }),
  });

  return response.data;
}
