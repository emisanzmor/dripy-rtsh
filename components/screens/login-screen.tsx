"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDripy } from "@/lib/dripy-context";
import Image from "next/image";
import { Droplets } from "lucide-react";

export function LoginScreen() {
  const { login } = useDripy();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="min-h-screen bg-[#84aa4d] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xs space-y-6">
        {/* Logo and mascot */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative w-24 h-24 animate-bounce-gentle">
            <Image
              src="/mascot-happy.png"
              alt="Dripy la gota de agua"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse-ring -z-10 scale-125" />
          </div>
          
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-white" />
            <h1 className="text-3xl font-bold text-white tracking-tight">Dripy</h1>
          </div>
          
          <p className="text-white/80 text-center text-sm text-pretty px-2">
            Ahorra agua, gana recompensas y ayuda al planeta!
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Correo electronico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl bg-[#cce6b3] border-2 border-[#3d5a22] px-4 text-sm font-medium text-[#3d5a22] placeholder:text-[#3d5a22]/50 shadow-[2px_2px_0px_0px_#4a6a2a] focus:shadow-[1px_1px_0px_0px_#4a6a2a] focus:translate-x-[1px] focus:translate-y-[1px]"
          />
          <Input
            type="password"
            placeholder="Contrasena"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl bg-[#cce6b3] border-2 border-[#3d5a22] px-4 text-sm font-medium text-[#3d5a22] placeholder:text-[#3d5a22]/50 shadow-[2px_2px_0px_0px_#4a6a2a] focus:shadow-[1px_1px_0px_0px_#4a6a2a] focus:translate-x-[1px] focus:translate-y-[1px]"
          />
          
          <Button
            type="submit"
            variant="sketch"
            className="w-full h-12 rounded-xl font-semibold text-base"
          >
            Iniciar Sesion
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/40" />
          <span className="text-sm text-white/80 font-medium">o</span>
          <div className="flex-1 h-px bg-white/40" />
        </div>

        {/* Sign up button */}
        <Button
          variant="sketch"
          onClick={() => login()}
          className="w-full h-12 rounded-xl font-semibold text-base"
        >
          Crear Cuenta
        </Button>

        {/* Skip for demo */}
        <button
          type="button"
          onClick={() => login()}
          className="w-full text-center text-white/70 hover:text-white text-xs"
        >
          Continuar como invitado
        </button>
      </div>
    </div>
  );
}
