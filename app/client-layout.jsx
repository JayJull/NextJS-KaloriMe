"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/utils/registerServiceWorker";

export default function ClientLayout({ children }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return <>{children}</>;
}
