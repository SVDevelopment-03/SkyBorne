"use client";

import { useEffect } from "react";

export default function ConsoleSilencer() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
  }, []);

  return null;
}
