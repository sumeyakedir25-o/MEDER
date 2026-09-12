"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPlacePage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const id = params.id;

    if (id) {
      router.replace(`/admin/places/new?edit=${id}`);
    }
  }, [params.id, router]);

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
      <p className="text-white/50">Loading place editor...</p>
    </main>
  );
}