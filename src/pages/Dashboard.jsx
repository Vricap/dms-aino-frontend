import { DashboardStats } from "../components/dashboard-stats";

export default function Dashboard() {
  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Document Management System
          </h1>
          <p className="text-muted-foreground">
            Platform untuk memanajemen, tanda tangan dan track dokumen PT. AINO.
          </p>
        </div>

        <DashboardStats />
      </div>
    </main>
  );
}
