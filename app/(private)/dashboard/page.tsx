"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function Dashboard() {
  const router = useRouter();
  const { user, userProfile, isLoading } = useAuth();

  // 🔹 Enquanto carrega dados do usuário
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // 🔹 Caso não esteja logado
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Não Logado</p>
      </div>
    );
  }

  // ✅ Se estiver logado, redireciona conforme o perfil
  useEffect(() => {
    if (userProfile?.profile) {
      const role = userProfile.profile.toLowerCase();
      router.replace(`/dashboard/${role}`);
    }
  }, [userProfile, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecionando para o seu Painel...</p>
    </div>
  );
}
