"use client";

export const dynamic = "force-dynamic";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRedirectMutation } from "@/store/api/publicApi";
import { getAccessToken } from "@/lib/token";
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
  const router = useRouter();
  const token = params.get("token");

  const [redirect] = useRedirectMutation();

  useEffect(() => {
    if (!token) return;

    const accessToken = getAccessToken();
    const nextUrl = `/zoom-redirect?token=${encodeURIComponent(token)}`;

    if (!accessToken) {
      router.replace(`/login?next=${encodeURIComponent(nextUrl)}`);
      return;
    }

    const trigger = async () => {
      try {
        const res = await redirect({ token }).unwrap();

        if (res?.joinUrl) {
          window.location.href = res.joinUrl;
        } else {
          console.error("Zoom join URL missing.");
        }
      } catch (error: any) {
        const status = error?.status || error?.data?.status;
        if (status === 401) {
          router.replace(`/login?next=${encodeURIComponent(nextUrl)}`);
          return;
        }
        console.error("Redirect API error:", error);
      }
    };

    trigger();
  }, [token, redirect, router]);

  return <p>Redirecting to meeting...</p>;
}
