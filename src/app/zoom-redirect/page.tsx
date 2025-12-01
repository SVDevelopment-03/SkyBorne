"use client";

export const dynamic = "force-dynamic";


import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRedirectMutation } from "@/store/api/publicApi";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ZoomRedirect />
    </Suspense>
  );
}






 function ZoomRedirect() {
  const params = useSearchParams();
  const token = params.get("token");

  const [redirect, { isLoading }] = useRedirectMutation();

  useEffect(() => {
    if (!token) return;

    const trigger = async () => {
      try {
        const res = await redirect({ token }).unwrap();

        if (res?.joinUrl) {
          window.location.href = res.joinUrl;
        } else {
          console.error("Zoom join URL missing.");
        }
      } catch (error) {
        console.error("Redirect API error:", error);
      }
    };

    trigger();
  }, [token]);

  return <p>Redirecting to meeting...</p>;
}
