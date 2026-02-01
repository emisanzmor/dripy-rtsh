"use client";

import { useDripy } from "@/lib/dripy-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardScreenProps {
  onBack: () => void;
  onNavigateToImpact?: () => void;
}

export function LeaderboardScreen({ onBack, onNavigateToImpact }: LeaderboardScreenProps) {
  const { leaderboard, user } = useDripy();

  const userPosition = leaderboard.findIndex((m) => m.name === "Tu") + 1;

  const getPositionStyle = (position: number) => {
    if (position === 1) return "bg-[#cce6b3] border-[#3d5a22]  shadow-[2px_2px_0px_0px_#4a6a2a]";
    if (position === 2) return "bg-[#cce6b3] border-[#3d5a22]  shadow-[2px_2px_0px_0px_#4a6a2a]";
    if (position === 3) return "bg-[#cce6b3] border-[#3d5a22]  shadow-[2px_2px_0px_0px_#4a6a2a]";
    return "bg-[#cce6b3] border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a]";
  };

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Crown className="w-4 h-4 text-amber-500" />;
    if (position === 2) return <Medal className="w-4 h-4 text-slate-500" />;
    if (position === 3) return <Medal className="w-4 h-4 text-orange-500" />;
    return null;
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
          <p className="text-2xl font-bold text-white">#{userPosition}</p>
          <p className="text-xs text-white/70">{user.points.toLocaleString()} pts</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-6">
        <h1 className="text-xl font-semibold text-white mb-6">Ranking semanal</h1>
        
        {/* Leaderboard list */}
        <div className="space-y-2">
          {leaderboard.map((member, index) => {
            const isCurrentUser = member.name === "Tu";
            const position = index + 1;
            const icon = getPositionIcon(position);

            return (
              <button
                key={member.id}
                onClick={isCurrentUser ? onNavigateToImpact : undefined}
                disabled={!isCurrentUser}
                className={cn(
                  "w-full text-left p-3 rounded-2xl border-2 transition-all",
                  isCurrentUser 
                    ? "bg-[#e8f5e0] border-[#3d5a22] shadow-[3px_3px_0px_0px_#4a6a2a] hover:shadow-[1px_1px_0px_0px_#4a6a2a] hover:translate-x-[2px] hover:translate-y-[2px] ring-2 ring-[#3d5a22]/30" 
                    : getPositionStyle(position),
                  !isCurrentUser && position > 3 && "opacity-80"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Position */}
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold",
                    position === 1 && "bg-amber-200 text-amber-700",
                    position === 2 && "bg-slate-200 text-slate-700",
                    position === 3 && "bg-orange-200 text-orange-700",
                    position > 3 && "bg-[#3d5a22]/10 text-[#3d5a22]"
                  )}>
                    {icon || position}
                  </div>

                  {/* Avatar */}
                  <div className={cn(
                    "bg-[#3d5a22] w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                    
                   
                  )}>
                    <span className="text-sm font-bold text-white">{member.avatar}</span>
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium text-sm truncate text-[#3d5a22]",
                     
                      isCurrentUser && "font-bold text-[#3d5a22]"
                    )}>
                      {member.name}
                      {isCurrentUser && " (Tu)"}
                    </p>
                  </div>

                  {/* Points */}
                  <p className={cn(
                    "text-[#3d5a22] text-sm font-bold",
                    
                  )}>
                    {member.points.toLocaleString()}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-white/60 text-xs mt-8">
          El ranking se reinicia cada lunes
        </p>
      </div>
    </div>
  );
}
