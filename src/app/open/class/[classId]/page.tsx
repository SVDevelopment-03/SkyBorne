"use client";

import React from "react";
import { useParams } from "next/navigation";

export default function OpenClassPage() {
  const params = useParams<{ classId?: string | string[] }>();
  const decodedClassId = React.useMemo(() => {
    const rawParam = params?.classId;
    const raw = Array.isArray(rawParam) ? rawParam[0] : String(rawParam || "");
    try {
      return decodeURIComponent(raw).trim();
    } catch {
      return raw.trim();
    }
  }, [params?.classId]);

  const deeplink = React.useMemo(() => {
    if (!decodedClassId) return "";
    return `skybornedrop://class/${encodeURIComponent(decodedClassId)}`;
  }, [decodedClassId]);

  React.useEffect(() => {
    if (!deeplink) return;
    const openTimer = window.setTimeout(() => {
      window.location.href = deeplink;
    }, 50);

    const fallbackTimer = window.setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2500);

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, [deeplink]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        background: "#fbfbfb",
        color: "#111827",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
          Opening Skyborne…
        </h1>

        <p style={{ marginTop: 10, marginBottom: 18, color: "#6b7280" }}>
          If the app doesn&apos;t open automatically, use the button below.
        </p>

        <a
          href={deeplink || "#"}
          style={{
            display: "inline-block",
            width: "100%",
            textAlign: "center",
            padding: "12px 16px",
            borderRadius: 10,
            background: deeplink ? "#c94a7f" : "#e5e7eb",
            color: "#ffffff",
            fontWeight: 700,
            textDecoration: "none",
            pointerEvents: deeplink ? "auto" : "none",
          }}
        >
          Open in App
        </a>

        <a
          href="/dashboard"
          style={{
            display: "inline-block",
            width: "100%",
            textAlign: "center",
            marginTop: 10,
            padding: "12px 16px",
            borderRadius: 10,
            background: "#ffffff",
            color: "#c94a7f",
            border: "2px solid #c94a7f",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Continue on Web
        </a>
      </div>
    </div>
  );
}
