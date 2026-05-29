"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  getSavedListingIds,
  removeSavedListing,
  saveListing,
} from "@/lib/api/savedListings";

type SaveListingButtonProps = {
  listingId: string;
  variant?: "contained" | "outlined" | "text";
  onSavedChange?: (saved: boolean) => void;
};

export function SaveListingButton({
  listingId,
  variant = "outlined",
  onSavedChange,
}: SaveListingButtonProps) {
  const { session } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onSavedChangeRef = useRef(onSavedChange);

  useEffect(() => {
    onSavedChangeRef.current = onSavedChange;
  }, [onSavedChange]);

  useEffect(() => {
    async function loadSavedState() {
      if (!session?.accessToken) {
        setIsSaved(false);
        return;
      }

      try {
        const ids = await getSavedListingIds();
        const saved = ids.includes(listingId);
        setIsSaved(saved);
        onSavedChangeRef.current?.(saved);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load saved listing state.";
        setErrorMessage(message);
      }
    }

    void loadSavedState();
  }, [listingId, session?.accessToken]);

  async function handleToggle() {
    if (!session?.accessToken) {
      setErrorMessage("Sign in to save listings.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isSaved) {
        await removeSavedListing(listingId);
        setIsSaved(false);
        onSavedChangeRef.current?.(false);
      } else {
        await saveListing(listingId);
        setIsSaved(true);
        onSavedChangeRef.current?.(true);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update saved listing state.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {errorMessage ? <Alert severity="info">{errorMessage}</Alert> : null}
      <Button
        variant={variant}
        color={isSaved ? "secondary" : "primary"}
        onClick={handleToggle}
        disabled={isLoading}
      >
        {isSaved ? "Saved" : "Save listing"}
      </Button>
    </>
  );
}
