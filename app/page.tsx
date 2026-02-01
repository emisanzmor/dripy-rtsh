"use client";

import { useState } from "react";
import { DripyProvider } from "@/lib/dripy-context";
import { LoginScreen } from "@/components/screens/login-screen";
import { SurveyScreen } from "@/components/screens/survey-screen";
import { MainScreen } from "@/components/screens/main-screen";
import { LeaderboardScreen } from "@/components/screens/leaderboard-screen";
import { RewardsScreen } from "@/components/screens/rewards-screen";
import { ChecklistScreen } from "@/components/screens/checklist-screen";
import { ProfileScreen } from "@/components/screens/profile-screen";
import { EventsScreen } from "@/components/screens/events-screen";
import { ImpactScreen } from "@/components/screens/impact-screen";
import { useDripy } from "@/lib/dripy-context";
import { Droplets, Leaf, Sparkles } from "lucide-react";

function FloatingElements() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-20 left-[10%] w-4 h-6 bg-[var(--dripy-blue)]/30 rounded-full animate-float delay-100" />
      <div className="absolute top-40 right-[15%] w-3 h-5 bg-[var(--dripy-blue)]/20 rounded-full animate-float-reverse delay-300" />
      <div className="absolute top-60 left-[5%] w-2 h-3 bg-[var(--dripy-blue)]/25 rounded-full animate-float delay-500" />
      <div className="absolute bottom-40 right-[8%] w-5 h-7 bg-[var(--dripy-blue)]/20 rounded-full animate-float delay-200" />
      <div className="absolute top-32 right-[20%] text-[var(--dripy-green)]/40 animate-float-reverse">
        <Leaf className="w-6 h-6" />
      </div>
      <div className="absolute bottom-60 left-[12%] text-[var(--dripy-green)]/30 animate-float delay-700">
        <Leaf className="w-5 h-5 rotate-45" />
      </div>
      <div className="absolute top-48 left-[25%] text-[var(--dripy-gold)]/50 animate-sparkle">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="absolute bottom-32 right-[25%] text-[var(--dripy-gold)]/40 animate-sparkle delay-300">
        <Sparkles className="w-3 h-3" />
      </div>
    </div>
  );
}

type Screen = "login" | "survey" | "main" | "leaderboard" | "rewards" | "checklist" | "profile" | "events" | "impact";

function AppContent() {
  const { isLoggedIn, surveyCompleted } = useDripy();
  const [currentScreen, setCurrentScreen] = useState<Screen>("main");

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    setCurrentScreen("main");
  };

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  if (!surveyCompleted) {
    return <SurveyScreen />;
  }

  switch (currentScreen) {
    case "leaderboard":
    case "trophy":
      return <LeaderboardScreen onBack={handleBack} onNavigateToImpact={() => setCurrentScreen("impact")} />;
    case "rewards":
      return <RewardsScreen onBack={handleBack} />;
    case "checklist":
      return <ChecklistScreen onBack={handleBack} />;
    case "profile":
      return <ProfileScreen onBack={handleBack} />;
    case "events":
      return <EventsScreen onBack={handleBack} />;
    case "impact":
      return <ImpactScreen onBack={handleBack} />;
    default:
      return <MainScreen onNavigate={handleNavigate} />;
  }
}

export default function DripyApp() {
  return (
    <DripyProvider>
      <div className="min-h-screen bg-background relative">
        <FloatingElements />
        <div className="relative z-10">
          <AppContent />
        </div>
      </div>
    </DripyProvider>
  );
}
