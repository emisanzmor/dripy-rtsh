"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDripy, type SurveyData } from "@/lib/dripy-context";
import { cn } from "@/lib/utils";
import { Home, Building2, Trees, Waves, ChevronRight, ChevronLeft, TreeDeciduous, Droplets } from "lucide-react";
import Image from "next/image";

const questions = [
  {
    id: "residents",
    question: "Cuantas personas viven en tu hogar?",
    type: "number",
    options: [
      { value: 1, label: "Solo yo" },
      { value: 2, label: "2 personas" },
      { value: 3, label: "3 personas" },
      { value: 4, label: "4 personas" },
      { value: 5, label: "5+ personas" },
    ],
  },
  {
    id: "homeType",
    question: "Que tipo de vivienda tienes?",
    type: "select",
    options: [
      { value: "house", label: "Casa", icon: Home },
      { value: "apartment", label: "Departamento", icon: Building2 },
    ],
  },
  {
    id: "hasGarden",
    question: "Tienes jardin?",
    type: "boolean",
    options: [
      { value: true, label: "Si, tengo jardin", icon: Trees },
      { value: false, label: "No tengo jardin", icon: TreeDeciduous },
    ],
  },
  {
    id: "hasPool",
    question: "Tienes alberca?",
    type: "boolean",
    options: [
      { value: true, label: "Si, tengo alberca", icon: Waves },
      { value: false, label: "No tengo alberca", icon: Droplets },
    ],
  },
];

function QuizOption({
  label,
  selected,
  onClick,
  icon: Icon,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full px-4 py-3 rounded-xl font-medium text-sm border-2",
        "transition-all duration-200 flex items-center gap-2",
        selected
          ? "bg-[#e8f5e0] text-[#3d5a22] border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a]"
          : "bg-[#cce6b3] border-[#3d5a22] text-[#3d5a22] shadow-[3px_3px_0px_0px_#4a6a2a] hover:shadow-[2px_2px_0px_0px_#4a6a2a] hover:translate-x-[1px] hover:translate-y-[1px]",
        "active:shadow-[1px_1px_0px_0px_#4a6a2a] active:translate-x-[2px] active:translate-y-[2px]"
      )}
    >
      {Icon && (
        <div className={cn("p-1.5 rounded-lg shrink-0 border", selected ? "bg-[#3d5a22] border-[#3d5a22]" : "bg-white border-[#3d5a22]/30")}>
          <Icon className={cn("w-4 h-4", selected ? "text-white" : "text-[#3d5a22]")} />
        </div>
      )}
      <span className="truncate">{label}</span>
    </button>
  );
}

export function SurveyScreen() {
  const { completeSurvey } = useDripy();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string | boolean>>({});

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: number | string | boolean) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      completeSurvey(answers as unknown as SurveyData);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const isAnswered = answers[question.id] !== undefined;

  return (
    <div className="min-h-screen bg-[#84aa4d] flex flex-col p-4">
      {/* Progress bar */}
      <div className="w-full h-3 bg-[#cce6b3] border-2 border-[#3d5a22] rounded-full overflow-hidden mb-6 shadow-[2px_2px_0px_0px_#4a6a2a]">
        <div
          className="h-full bg-[#3d5a22] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center animate-slide-up" key={currentQuestion}>
        {/* Mascot */}
        <div className="relative w-20 h-20 mb-4 animate-bounce-gentle">
          <Image src="/mascot-happy.png" alt="Dripy" fill className="object-contain" />
        </div>

        {/* Question */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#cce6b3] border-2 border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a] mb-3">
            <span className="text-xs text-[#3d5a22] font-medium">
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-white text-balance px-2">{question.question}</h2>
        </div>

        {/* Options */}
        <div className="w-full max-w-xs space-y-2">
          {question.options.map((option) => {
            const isSelected = answers[question.id] === option.value;
            const Icon = "icon" in option ? option.icon : undefined;

            return (
              <QuizOption
                key={String(option.value)}
                label={option.label}
                selected={isSelected}
                onClick={() => handleAnswer(option.value)}
                icon={Icon}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-6">
        {currentQuestion > 0 && (
          <Button
            variant="sketch"
            onClick={handleBack}
            className="flex-1 h-12 rounded-xl font-medium text-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Atras
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!isAnswered}
          variant="sketch"
          className={cn(
            "flex-1 h-12 rounded-xl font-semibold text-sm",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          )}
        >
          {currentQuestion < questions.length - 1 ? (
            <>
              Continuar
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          ) : (
            "Vamos!"
          )}
        </Button>
      </div>
    </div>
  );
}
