import client from "@/lib/api/client";
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
): Promise<EnhanceListingDescriptionResult> {
  const res = await client.post<
    ApiSuccessResponse<EnhanceListingDescriptionResult>
  >("/ai/listings/description-enhance", payload, {
    meta: { auth: "required" },
  });
  return res.data.data;
}

export async function interpretListingSearch(
  query: string,
): Promise<InterpretedListingSearch> {
  const res = await client.post<ApiSuccessResponse<InterpretedListingSearch>>(
    "/ai/search/interpret",
    { query },
  );
  return res.data.data;
}
