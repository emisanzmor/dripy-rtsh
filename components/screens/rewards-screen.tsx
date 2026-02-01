"use client";

import { useDripy } from "@/lib/dripy-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RewardsScreenProps {
  onBack: () => void;
}

export function RewardsScreen({ onBack }: RewardsScreenProps) {
  const { rewards, user, redeemReward } = useDripy();
  const [redeemedIds, setRedeemedIds] = useState<Set<string>>(new Set());

  const handleRedeem = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && user.points >= reward.pointsCost && !redeemedIds.has(rewardId)) {
      redeemReward(rewardId);
      setRedeemedIds(prev => new Set(prev).add(rewardId));
    }
  };

  return (
    <div className="min-h-screen bg-[#84aa4d] flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Button
          variant="sketch"
          size="icon"
          onClick={onBack}
          className="w-10 h-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{user.points.toLocaleString()}</p>
          <p className="text-xs text-white/70">puntos disponibles</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-6">
        <h1 className="text-xl font-semibold text-white mb-6">Canjear premios</h1>
        
        {/* Rewards list */}
        <div className="space-y-3">
          {rewards.map((reward) => {
            const canRedeem = user.points >= reward.pointsCost;
            const isRedeemed = redeemedIds.has(reward.id);

            return (
              <button
                key={reward.id}
                onClick={() => !isRedeemed && canRedeem && handleRedeem(reward.id)}
                disabled={!canRedeem || isRedeemed}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border-2 transition-all",
                  "bg-[#cce6b3] border-[#3d5a22]",
                  canRedeem && !isRedeemed && "shadow-[3px_3px_0px_0px_#4a6a2a] hover:shadow-[1px_1px_0px_0px_#4a6a2a] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]",
                  !canRedeem && "opacity-50",
                  isRedeemed && "opacity-70"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#3d5a22]">{reward.brand}</p>
                    <p className="text-sm text-[#5a7a35] mt-0.5">{reward.title}</p>
                  </div>
                  
                  <div className="text-right shrink-0">
                    {isRedeemed ? (
                      <div className="flex items-center gap-1 text-[#3d5a22]">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">Canjeado</span>
                      </div>
                    ) : (
                      <p className={cn(
                        "text-lg font-bold",
                        canRedeem ? "text-[#3d5a22]" : "text-[#3d5a22]/50"
                      )}>
                        {reward.pointsCost.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-white/60 text-xs mt-8">
          Los códigos se envían por correo en menos de 24 horas
        </p>
      </div>
    </div>
  );
}
