"use client";

import { useDripy } from "@/lib/dripy-context";
import { Trophy, Gift, CheckCircle, User, Flame, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MainScreenProps {
  onNavigate: (screen: string) => void;
}

const navItems = [
  { id: "trophy", icon: Trophy, label: "Ranking" },
  { id: "events", icon: Calendar, label: "Eventos" },
  { id: "checklist", icon: CheckCircle, label: "Acciones" },
  { id: "impact", icon: BarChart3, label: "Impacto" },
  { id: "rewards", icon: Gift, label: "Premios" },
  { id: "profile", icon: User, label: "Perfil" },
];

const rankImages: Record<string, string> = {
  bronce: "/mascot-happy.png",
  plata: "/rank-plata.png",
  oro: "/rank-oro.png",
  diamante: "/rank-oro.png",
};

export function MainScreen({ onNavigate }: MainScreenProps) {
  const { user } = useDripy();

  const rankLabel = {
    bronce: "Bronce",
    plata: "Plata",
    oro: "Oro",
    diamante: "Diamante",
  };

  const rankColor = {
    bronce: "text-amber-200",
    plata: "text-slate-200",
    oro: "text-[var(--dripy-gold)]",
    diamante: "text-purple-200",
  };

  return (
    <div className="min-h-screen bg-[#84aa4d] flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden">
      {/* Floating environmental elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Water drops */}
        <div className="absolute top-[8%] left-[10%] w-3 h-5 opacity-30 animate-float" style={{ animationDelay: "0s" }}>
          <svg viewBox="0 0 24 36" fill="none" className="w-full h-full">
            <path d="M12 0C12 0 0 14 0 22C0 30 5.4 36 12 36C18.6 36 24 30 24 22C24 14 12 0 12 0Z" fill="url(#dropGrad1)"/>
            <defs>
              <linearGradient id="dropGrad1" x1="12" y1="0" x2="12" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA"/>
                <stop offset="1" stopColor="#3B82F6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute top-[20%] right-[8%] w-2.5 h-4 opacity-25 animate-float" style={{ animationDelay: "1.5s" }}>
          <svg viewBox="0 0 24 36" fill="none" className="w-full h-full">
            <path d="M12 0C12 0 0 14 0 22C0 30 5.4 36 12 36C18.6 36 24 30 24 22C24 14 12 0 12 0Z" fill="#60A5FA"/>
          </svg>
        </div>
        
        {/* Green drops */}
        <div className="absolute top-[55%] left-[5%] w-2 h-3 opacity-25 animate-float" style={{ animationDelay: "0.8s" }}>
          <svg viewBox="0 0 24 36" fill="none" className="w-full h-full">
            <path d="M12 0C12 0 0 14 0 22C0 30 5.4 36 12 36C18.6 36 24 30 24 22C24 14 12 0 12 0Z" fill="#34D399"/>
          </svg>
        </div>
        
        {/* Floating leaves */}
        <div className="absolute top-[12%] right-[15%] w-6 h-6 opacity-15 animate-float-slow" style={{ animationDelay: "0.5s" }}>
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full rotate-[-20deg]">
            <path d="M20 2C20 2 35 10 35 25C35 32 28 38 20 38C12 38 5 32 5 25C5 10 20 2 20 2Z" fill="#34D399"/>
            <path d="M20 8V32M12 20C12 20 16 16 20 16C24 16 28 20 28 20" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="absolute bottom-[22%] left-[8%] w-5 h-5 opacity-12 animate-float-slow" style={{ animationDelay: "1.2s" }}>
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full rotate-[30deg]">
            <path d="M20 2C20 2 35 10 35 25C35 32 28 38 20 38C12 38 5 32 5 25C5 10 20 2 20 2Z" fill="#34D399"/>
            <path d="M20 8V32M12 20C12 20 16 16 20 16C24 16 28 20 28 20" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        
        {/* Small circles/dots */}
        <div className="absolute top-[30%] left-[22%] w-1.5 h-1.5 rounded-full bg-[#60A5FA]/20 animate-bubble" style={{ animationDelay: "0s" }} />
        <div className="absolute top-[48%] right-[20%] w-1 h-1 rounded-full bg-[#34D399]/25 animate-bubble" style={{ animationDelay: "1s" }} />
      </div>

      {/* Top Streak Bar */}
      {user.streak > 0 && (
        <div className="w-full max-w-sm bg-[#cce6b3] border-2 border-[#3d5a22] rounded-xl px-4 py-3 mb-6 z-10 shadow-[2px_2px_0px_0px_#4a6a2a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0">
                <Image 
                  src="/dripy-streak.png" 
                  alt="Dripy en racha" 
                  fill 
                  className="object-contain"
                />
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#3d5a22]" />
                <span className="font-bold text-base text-[#3d5a22]">{user.streak} dias</span>
              </div>
            </div>
            <span className="text-sm text-[#3d5a22] font-medium">En fuego!</span>
          </div>
        </div>
      )}

      {/* Central Rank Badge */}
      <div className="relative w-72 h-80 mb-3 z-10">
        {/* Background layer */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <Image
            src="/rank-fondo.png"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#84aa4d]/90 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#84aa4d]/90 to-transparent" />
        </div>
        
        {/* Rank badge on top */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-48 h-48">
            <Image
              src={rankImages[user.rank] || "/placeholder.svg"}
              alt={`Rango ${rankLabel[user.rank]}`}
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>
        
        {/* Pulse ring effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-44 h-44 bg-[var(--dripy-blue)]/5 rounded-full animate-pulse-ring" />
        </div>
      </div>

      {/* Rank Label */}
      <div className="text-center mb-6 z-10">
        <p className={cn("text-3xl font-bold drop-shadow-md", rankColor[user.rank])}>
          {rankLabel[user.rank]}
        </p>
        <p className="text-base text-white/80 mt-1">
          Nivel {user.level} • {user.points.toLocaleString()} pts
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="z-10 w-full max-w-sm px-2">
        <div className="grid grid-cols-3 gap-3">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="sketch"
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center gap-1.5 p-4 h-auto rounded-xl"
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
