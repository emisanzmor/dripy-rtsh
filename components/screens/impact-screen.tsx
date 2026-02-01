"use client";

import React from "react";
import { useDripy } from "@/lib/dripy-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, FileImage, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import Image from "next/image";

interface ImpactScreenProps {
  onBack: () => void;
}

const connectableApps = [
  { id: "nest", name: "Google Nest", initial: "N" },
  { id: "tesla", name: "Tesla Energy", initial: "T" },
  { id: "smart-things", name: "SmartThings", initial: "S" },
  { id: "alexa", name: "Amazon Alexa", initial: "A" },
];

export function ImpactScreen({ onBack }: ImpactScreenProps) {
  const { consumptionHistory, user, uploadBill } = useDripy();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeChart, setActiveChart] = useState<"water" | "electricity">("water");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstMonth = consumptionHistory[0];
  const lastMonth = consumptionHistory[consumptionHistory.length - 1];
  const waterReduction = Math.round(((firstMonth.water - lastMonth.water) / firstMonth.water) * 100);
  const electricityReduction = Math.round(((firstMonth.electricity - lastMonth.electricity) / firstMonth.electricity) * 100);

  const maxWater = Math.max(...consumptionHistory.map((d) => d.water));
  const maxElectricity = Math.max(...consumptionHistory.map((d) => d.electricity));

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      uploadBill(uploadedImage || "/recibo-agua.png");
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadedImage(null);
        setUploadSuccess(false);
      }, 1500);
    }, 1500);
  };

  const handleUseSampleBill = () => {
    setUploadedImage("/recibo-agua.png");
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
          <p className="text-2xl font-bold text-white">-{waterReduction}%</p>
          <p className="text-xs text-white/70">consumo de agua</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-6 space-y-4 overflow-auto">
        <h1 className="text-xl font-semibold text-white">Tu impacto</h1>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-[#cce6b3] border-2 border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a]">
            <p className="text-2xl font-bold text-[#3d5a22]">-{waterReduction}%</p>
            <p className="text-xs text-[#5a7a35]">Agua</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#cce6b3] border-2 border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a]">
            <p className="text-2xl font-bold text-[#3d5a22]">-{electricityReduction}%</p>
            <p className="text-xs text-[#5a7a35]">Luz</p>
          </div>
        </div>

        {/* Accumulated impact */}
        <div className="p-4 rounded-2xl bg-[#cce6b3] border-2 border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a]">
          <p className="text-xs font-medium text-[#5a7a35] mb-2">Impacto acumulado</p>
          <div className="flex justify-between">
            <div>
              <p className="text-lg font-bold text-[#3d5a22]">{(user.waterSaved / 1000).toFixed(1)}k L</p>
              <p className="text-[10px] text-[#5a7a35]">Agua ahorrada</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#3d5a22]">{Math.round(user.waterSaved * 0.002)} kg</p>
              <p className="text-[10px] text-[#5a7a35]">CO2 evitado</p>
            </div>
          </div>
        </div>

        {/* Chart toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveChart("water")}
            className={cn(
              "flex-1 py-3 rounded-xl font-medium text-sm transition-all border-2",
              activeChart === "water"
                ? "bg-[#cce6b3] text-[#3d5a22] border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a]"
                : "bg-[#cce6b3]/50 border-[#3d5a22]/50 text-[#3d5a22]/70"
            )}
          >
            Agua
          </button>
          <button
            onClick={() => setActiveChart("electricity")}
            className={cn(
              "flex-1 py-3 rounded-xl font-medium text-sm transition-all border-2",
              activeChart === "electricity"
                ? "bg-[#cce6b3] text-[#3d5a22] border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a]"
                : "bg-[#cce6b3]/50 border-[#3d5a22]/50 text-[#3d5a22]/70"
            )}
          >
            Luz
          </button>
        </div>

        {/* Chart */}
        <div className="p-4 rounded-2xl bg-[#cce6b3] border-2 border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-[#3d5a22]">
              {activeChart === "water" ? "Consumo de Agua" : "Consumo de Luz"}
            </p>
            <span className="text-xs text-[#5a7a35]">6 meses</span>
          </div>

          {/* Chart bars */}
          <div className="space-y-2">
            {consumptionHistory.map((data, index) => {
              const value = activeChart === "water" ? data.water : data.electricity;
              const max = activeChart === "water" ? maxWater : maxElectricity;
              const width = (value / max) * 100;
              const isLast = index === consumptionHistory.length - 1;

              return (
                <div key={data.month} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-[#3d5a22] w-8">{data.month}</span>
                  <div className="flex-1 h-6 bg-white/50 rounded-lg border border-[#3d5a22]/30 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-lg transition-all duration-500",
                        isLast ? "bg-[#3d5a22]" : "bg-[#3d5a22]/50"
                      )}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className={cn(
                    "text-xs font-medium w-10 text-right",
                    isLast ? "text-[#3d5a22]" : "text-[#5a7a35]"
                  )}>
                    {activeChart === "water" ? `${(value / 1000).toFixed(1)}k` : value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Trend indicator */}
          <div className="mt-4 pt-3 border-t border-[#3d5a22]/20 flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3d5a22]" />
            <span className="text-xs text-[#5a7a35]">Reducción constante</span>
          </div>
        </div>

        {/* Connect apps */}
        <div className="p-4 rounded-2xl bg-[#cce6b3] border-2 border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a]">
          <p className="text-sm font-medium text-[#3d5a22] mb-3">Conectar apps</p>
          <div className="space-y-2">
            {connectableApps.map((app) => (
              <button
                key={app.id}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#cce6b3] border-2 border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a] transition-all text-left hover:shadow-[1px_1px_0px_0px_#4a6a2a] hover:translate-x-[1px] hover:translate-y-[1px]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#3d5a22] flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-[#cce6b3]">{app.initial}</span>
                </div>
                <span className="text-sm font-medium text-[#3d5a22] flex-1">{app.name}</span>
                <span className="text-xs text-[#5a7a35]">Conectar</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upload button */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="w-full p-4 rounded-2xl bg-[#cce6b3] border-2 border-[#3d5a22] shadow-[3px_3px_0px_0px_#4a6a2a] transition-all hover:shadow-[1px_1px_0px_0px_#4a6a2a] hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-[#3d5a22]" />
              <span className="font-semibold text-[#3d5a22]">Subir recibo</span>
            </div>
            <span className="text-sm font-bold text-[#3d5a22]">+150</span>
          </div>
        </button>

        {/* Footer note */}
        <p className="text-center text-white/60 text-xs">
          Sube recibos para mejor seguimiento
        </p>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#cce6b3] rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-4 animate-slide-up border-2 border-[#3d5a22] shadow-[4px_4px_0px_0px_#4a6a2a]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#3d5a22]">Subir recibo</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedImage(null);
                  setUploadSuccess(false);
                }}
                className="text-[#3d5a22]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 mx-auto mb-3 bg-[#cce6b3] rounded-xl flex items-center justify-center border-2 border-[#3d5a22] shadow-[2px_2px_0px_0px_#4a6a2a]">
                  <Check className="w-7 h-7 text-[#3d5a22]" />
                </div>
                <p className="font-semibold text-lg text-[#3d5a22]">Listo!</p>
                <p className="text-sm text-[#5a7a35]">+150 puntos</p>
              </div>
            ) : uploadedImage ? (
              <div className="space-y-3">
                <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-[#3d5a22]">
                  <Image src={uploadedImage} alt="Recibo" fill className="object-contain" />
                </div>
                <Button
                  variant="sketch"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full h-12 rounded-xl font-bold"
                >
                  {isUploading ? "Subiendo..." : "Confirmar"}
                </Button>
                <button
                  onClick={() => setUploadedImage(null)}
                  className="w-full text-sm text-[#3d5a22] py-2"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-6 border-2 border-dashed border-[#3d5a22] rounded-xl hover:bg-[#e8f5e0] transition-all"
                >
                  <FileImage className="w-8 h-8 mx-auto text-[#5a7a35] mb-2" />
                  <p className="font-medium text-sm text-[#3d5a22]">Seleccionar archivo</p>
                </button>

                <Button
                  variant="sketch"
                  onClick={handleUseSampleBill}
                  className="w-full h-10 rounded-xl font-medium text-sm"
                >
                  Usar ejemplo
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
