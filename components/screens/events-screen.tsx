"use client";

import { useDripy } from "@/lib/dripy-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

interface EventsScreenProps {
  onBack: () => void;
}

export function EventsScreen({ onBack }: EventsScreenProps) {
  const { events, attendEvent } = useDripy();
  const [attendedEvents, setAttendedEvents] = useState<Set<string>>(new Set());

  const handleAttend = (eventId: string) => {
    if (!attendedEvents.has(eventId)) {
      attendEvent(eventId);
      setAttendedEvents((prev) => new Set(prev).add(eventId));
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
          <p className="text-2xl font-bold text-white">{events.length}</p>
          <p className="text-xs text-white/70">eventos cerca</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-6">
        <h1 className="text-xl font-semibold text-white mb-4">Eventos</h1>
        
        {/* Events list */}
        <div className="space-y-3">
          {events.map((event) => {
            const isAttended = attendedEvents.has(event.id);

            return (
              <button
                key={event.id}
                onClick={() => !isAttended && handleAttend(event.id)}
                disabled={isAttended}
                className={cn(
                  "w-full rounded-2xl overflow-hidden transition-all text-left border-2",
                  "bg-[#cce6b3] border-[#3d5a22]",
                  !isAttended && "shadow-[3px_3px_0px_0px_#4a6a2a] hover:shadow-[1px_1px_0px_0px_#4a6a2a] hover:translate-x-[2px] hover:translate-y-[2px]",
                  isAttended && "opacity-70"
                )}
              >
                {/* Image */}
                <div className="relative w-full h-28">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  {event.isPaidPromotion && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#cce6b3] border-2 border-[#3d5a22] rounded-full">
                      <span className="text-[9px] font-bold text-[#3d5a22]">PROMOCIONADO</span>
                    </div>
                  )}
                  {isAttended && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-[#cce6b3] border-2 border-[#3d5a22] rounded-full">
                      <Check className="w-3 h-3 text-[#3d5a22]" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-[#3d5a22]">{event.title}</p>
                    <p className="text-xs text-[#5a7a35]">{event.distance} km</p>
                  </div>
                  {!isAttended && (
                    <span className="text-sm font-bold text-[#3d5a22]">+50</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-white/60 text-xs mt-6">
          Confirma asistencia para ganar puntos
        </p>
      </div>
    </div>
  );
}
