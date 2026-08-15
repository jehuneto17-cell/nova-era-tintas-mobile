"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { EditarPerfilForm } from "./EditarPerfilForm";

export default function EditarPerfilPage() {
  const router = useRouter();
  const { user, cliente, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) router.push("/entrada");
  }, [authLoading, user, router]);

  if (authLoading || !user || !cliente) {
    return (
      <div className="absolute inset-0 bg-white flex items-center justify-center">
        <span className="w-8 h-8 rounded-full border-[3px] border-[#E5E5E5] border-t-ne-green" style={{ animation: "ne-spin .8s linear infinite" }} />
      </div>
    );
  }

  return <EditarPerfilForm key={cliente.id} user={user} cliente={cliente} />;
}
