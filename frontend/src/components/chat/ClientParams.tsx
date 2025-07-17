"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface ClientParamsProps {
  onParams: (id: string | null) => void;
}

export default function ClientParams({ onParams }: ClientParamsProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("with");
    onParams(id);
  }, [searchParams, onParams]);

  return null;
}
