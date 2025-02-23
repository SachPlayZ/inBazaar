"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

interface BargainModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItemId: string;
  onAccept: (price: number) => void;
  initialPrice: number;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export function BargainModal({
  isOpen,
  onClose,
  cartItemId,
  onAccept,
  initialPrice,
}: BargainModalProps) {
  const { user } = useUser();
  const [message, setMessage] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number>(initialPrice);
  const [loading, setLoading] = useState(false);
  const [canContinue, setCanContinue] = useState(true);
  const [attemptCount, setAttemptCount] = useState(0);

  // Reset state when modal opens with new item
  useEffect(() => {
    if (isOpen) {
      setCurrentPrice(initialPrice);
      setMessage("");
      setCanContinue(true);
      setAttemptCount(0);
    }
  }, [isOpen, initialPrice]);

  const handleStartBargaining = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BACKEND_URL}/bargain/chat?cartItemId=${cartItemId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to start bargaining");
      }

      const { data } = await response.json();
      setMessage(data.message.replace(/^"|"$/g, "")); // Remove quotes
      setCurrentPrice(data.currentPrice);
    } catch (error) {
      console.error("Error starting bargain:", error);
      toast.error("Failed to start bargaining");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueBargaining = async () => {
    try {
      setLoading(true);
      const endpoint = attemptCount === 0 ? "chat" : "continue";
      const method = "POST";

      const response = await fetch(`${BACKEND_URL}/bargain/${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          attemptCount === 0
            ? { cartItemId }
            : {
                cartItemId,
                currentPrice,
                initialPrice,
                stopLossPercentage: 10,
              }
        ),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${attemptCount === 0 ? "start" : "continue"} bargaining`
        );
      }

      const { data } = await response.json();
      setMessage(data.message.replace(/^"|"$/g, "")); // Remove quotes
      setCurrentPrice(data.currentPrice);
      setAttemptCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error in bargaining:", error);
      toast.error("Failed to continue bargaining");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/bargain/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          cartItemId,
          suggestedPrice: currentPrice,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to accept offer: ${errorText}`);
      }

      onAccept(currentPrice);
      toast.success("Offer accepted successfully!");
      onClose();
    } catch (error) {
      console.error("Error accepting offer:", error);
      toast.error("Failed to accept offer");
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineOffer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/bargain/decline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: user?.username,
          productId: cartItemId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to decline offer: ${errorText}`);
      }

      toast.success("Offer declined");
      onClose();
    } catch (error) {
      console.error("Error declining offer:", error);
      toast.error("Failed to decline offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bargaining Session</DialogTitle>
          <DialogDescription>
            Current offer: ₹{currentPrice.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">{message}</p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleDeclineOffer}
              disabled={loading}
            >
              Decline Offer
            </Button>
            <Button
              variant="outline"
              onClick={handleContinueBargaining}
              disabled={loading || !canContinue}
            >
              Continue Bargaining
            </Button>
            <Button onClick={handleAcceptOffer} disabled={loading}>
              Accept Offer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
