import { Suspense } from "react";
import Dashboard from "@/views/dashboard/dashboard-view";

export default function DashboardPage() {
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <Dashboard />
    </Suspense>
  );
}
