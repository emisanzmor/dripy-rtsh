"use client";

import { useDripy } from "@/lib/dripy-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ChecklistScreenProps {
  onBack: () => void;
}

export function ChecklistScreen({ onBack }: ChecklistScreenProps) {
  const { actions, completeAction, user } = useDripy();
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const completedCount = actions.filter((a) => a.completed).length;
  const progress = (completedCount / actions.length) * 100;

  const handleComplete = (id: string) => {
    setAnimatingId(id);
    setTimeout(() => {
      completeAction(id);
      setAnimatingId(null);
    }, 200);
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
          <p className="text-2xl font-bold text-white">{completedCount}/{actions.length}</p>
          <p className="text-xs text-white/70">completadas</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-6">
        <h1 className="text-xl font-semibold text-white mb-4">Acciones diarias</h1>
        
        {/* Progress bar */}
        <div className="h-2.5 bg-[#cce6b3] border-2 border-[#3d5a22] rounded-full overflow-hidden shadow-[2px_2px_0px_0px_#4a6a2a] mb-5">
          <div
            className="h-full bg-[#3d5a22] transition-all rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Actions list */}
        <div className="space-y-2.5">
          {actions.map((action) => {
            const isAnimating = animatingId === action.id;
            const displayPoints = user.isPro ? action.points * 2 : action.points;

            return (
              <button
                key={action.id}
                onClick={() => !action.completed && handleComplete(action.id)}
                disabled={action.completed}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border-2 transition-all",
                  "bg-[#cce6b3] border-[#3d5a22]",
                  !action.completed && "shadow-[3px_3px_0px_0px_#4a6a2a] hover:shadow-[1px_1px_0px_0px_#4a6a2a] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]",
                  action.completed && "opacity-60",
                  isAnimating && "scale-95 opacity-70"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <div
                    className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border-2",
                      action.completed
                        ? "bg-[#3d5a22] border-[#3d5a22]"
                        : "bg-white border-[#3d5a22]"
                    )}
                  >
                    {action.completed && <Check className="w-4 h-4 text-white" />}
                  </div>

                  {/* Title */}
                  <span
                    className={cn(
                      "flex-1 font-medium text-[#3d5a22]",
                      action.completed && "line-through opacity-70"
                    )}
                  >
                    {action.title}
                  </span>

                  {/* Points */}
                  <span className="text-sm font-bold text-[#3d5a22]">
                    +{displayPoints}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Completion message */}
        {completedCount === actions.length && (
          <div className="text-center py-6 animate-slide-up">
            <div className="w-12 h-12 mx-auto mb-3 bg-[#cce6b3] border-2 border-[#3d5a22] rounded-xl shadow-[2px_2px_0px_0px_#4a6a2a] flex items-center justify-center">
              <Check className="w-6 h-6 text-[#3d5a22]" />
            </div>
            <p className="font-semibold text-white text-lg">Completado!</p>
            <p className="text-sm text-white/70">Vuelve mañana</p>
          </div>
        )}

        {/* Footer note */}
        {completedCount < actions.length && (
          <p className="text-center text-white/60 text-xs mt-8">
            Completa acciones para ganar puntos
          </p>
        )}
      </div>
    </div>
  );
}
