"use client";

import { useDripy, type Rank } from "@/lib/dripy-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

interface ProfileScreenProps {
  onBack: () => void;
}

const rankLabels: Record<Rank, string> = {
  bronce: "Bronce",
  plata: "Plata",
  oro: "Oro",
  diamante: "Diamante",
};

const rankProgress: Record<Rank, { next: Rank | null; threshold: number }> = {
  bronce: { next: "plata", threshold: 750 },
  plata: { next: "oro", threshold: 1500 },
  oro: { next: "diamante", threshold: 2500 },
  diamante: { next: null, threshold: 9999 },
};

const connectableApps = [
  { id: "apple-health", name: "Apple Health", initial: "A", connected: true },
  { id: "strava", name: "Strava", initial: "S", connected: false },
  { id: "nest", name: "Google Nest", initial: "N", connected: false },
  { id: "tesla", name: "Tesla Energy", initial: "T", connected: true },
];

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { user, simulateLevelUp, upgradeToPro } = useDripy();
  const [showProModal, setShowProModal] = useState(false);
  const [connectedApps, setConnectedApps] = useState<Set<string>>(
    new Set(connectableApps.filter(app => app.connected).map(app => app.id))
  );

  const currentRankInfo = rankProgress[user.rank];
  const prevThreshold =
    user.rank === "bronce" ? 0 : user.rank === "plata" ? 750 : user.rank === "oro" ? 1500 : 2500;
  const progressToNext = currentRankInfo.next
    ? ((user.points - prevThreshold) / (currentRankInfo.threshold - prevThreshold)) * 100
    : 100;

  const handleUpgradeToPro = () => {
    upgradeToPro();
    setShowProModal(false);
  };

  const toggleAppConnection = (appId: string) => {
    setConnectedApps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appId)) {
        newSet.delete(appId);
      } else {
        newSet.add(appId);
      }
      return newSet;
    });
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
          <p className="text-2xl font-bold text-white">Nivel {user.level}</p>
          <p className="text-xs text-white/70">{rankLabels[user.rank]}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-6 space-y-4 overflow-auto">
        {/* Profile card */}
        <div className="p-5 rounded-2xl bg-[#cce6b3] border-2 border-[#3d5a22] shadow-[3px_3px_0px_0px_#4a6a2a]">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0">
              <Image
                src="/mascot-happy.png"
                alt="Dripy"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-[#3d5a22] truncate">{user.name}</h2>
              <p className="text-sm text-[#5a7a35]">{user.points.toLocaleString()} puntos</p>
            </div>
          </div>

          {/* Rank progress */}
          {currentRankInfo.next && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#5a7a35]">{rankLabels[user.rank]}</span>
                <span className="text-[#5a7a35]">{rankLabels[currentRankInfo.next]}</span>
              </div>
              <div className="h-3 bg-white border-2 border-[#3d5a22] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3d5a22] transition-all rounded-full"
                  style={{ width: `${Math.min(progressToNext, 100)}%` }}
                />
              </div>
              <p className="text-xs text-[#5a7a35] mt-1.5 text-center">
                {currentRankInfo.threshold - user.points} pts para subir
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-[#cce6b3] border-2 border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a] rounded-2xl text-center">
            <p className="text-xl font-bold text-[#3d5a22]">{user.points.toLocaleString()}</p>
            <p className="text-xs text-[#5a7a35]">Puntos</p>
          </div>
          <div className="p-4 bg-[#cce6b3] border-2 border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a] rounded-2xl text-center">
            <p className="text-xl font-bold text-[#3d5a22]">{user.streak}</p>
            <p className="text-xs text-[#5a7a35]">Racha</p>
          </div>
          <div className="p-4 bg-[#cce6b3] border-2 border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a] rounded-2xl text-center">
            <p className="text-xl font-bold text-[#3d5a22]">{(user.waterSaved / 1000).toFixed(1)}k</p>
            <p className="text-xs text-[#5a7a35]">Litros</p>
          </div>
        </div>

        {/* Connect apps */}
        <div className="p-4 rounded-2xl bg-[#cce6b3] border-2 border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-[#3d5a22]">Apps conectadas</p>
            <span className="text-xs text-[#5a7a35]">{connectedApps.size}/{connectableApps.length}</span>
          </div>
          <div className="space-y-2">
            {connectableApps.map((app) => {
              const isConnected = connectedApps.has(app.id);
              return (
                <button
                  key={app.id}
                  onClick={() => toggleAppConnection(app.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left border-2",
                    "bg-[#cce6b3] border-[#3d5a22]",
                    isConnected 
                      ? "shadow-[2px_2px_0px_0px_#4a6a2a]" 
                      : "shadow-[2px_2px_0px_0px_#4a6a2a] opacity-60 hover:opacity-100"
                  )}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#3d5a22] flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-[#cce6b3]">{app.initial}</span>
                  </div>
                  <span className="text-sm font-medium text-[#3d5a22] flex-1">{app.name}</span>
                  {isConnected ? (
                    <Check className="w-5 h-5 text-[#3d5a22]" />
                  ) : (
                    <span className="text-xs text-[#5a7a35]">Conectar</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pro upgrade */}
        {!user.isPro && (
          <button
            onClick={() => setShowProModal(true)}
            className="w-full p-4 rounded-2xl bg-[#cce6b3] border-2 border-[#3d5a22] shadow-[3px_3px_0px_0px_#4a6a2a] transition-all hover:shadow-[1px_1px_0px_0px_#4a6a2a] hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="font-semibold text-[#3d5a22]">Dripy Pro</p>
                <p className="text-xs text-[#5a7a35]">2x puntos + recompensas</p>
              </div>
              <span className="text-sm font-bold text-[#3d5a22]">Mejorar</span>
            </div>
          </button>
        )}

        {/* Simulate points */}
        <Button
          variant="sketch"
          onClick={simulateLevelUp}
          className="w-full h-12 rounded-xl font-semibold"
        >
          Simular +{user.isPro ? "1000" : "500"} pts
        </Button>

        {/* Footer note */}
        <p className="text-center text-white/60 text-xs">
          Conecta apps para ganar más puntos
        </p>
      </div>

      {/* Pro modal */}
      {showProModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#cce6b3] rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-4 animate-slide-up border-2 border-[#3d5a22] shadow-[4px_4px_0px_0px_#4a6a2a]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#3d5a22]">Dripy Pro</h2>
              <button onClick={() => setShowProModal(false)} className="text-[#3d5a22]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-5 text-sm text-[#3d5a22]">
              <p>• 2x puntos en todas las acciones</p>
              <p>• Recompensas exclusivas</p>
              <p>• Avatares especiales</p>
            </div>

            <Button
              variant="sketch"
              onClick={handleUpgradeToPro}
              className="w-full h-12 rounded-xl font-bold"
            >
              Mejorar ahora
            </Button>
            <button
              onClick={() => setShowProModal(false)}
              className="w-full text-sm text-[#5a7a35] py-3"
            >
              Quizá después
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
