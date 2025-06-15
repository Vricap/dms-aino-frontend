import React from "react";
import { DashboardStats } from "../components/dashboard-stats.tsx";
import { RecentDocuments } from "../components/recent-documents.tsx";
import { PendingSignatures } from "../components/pending-signatures.tsx";
const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <DashboardStats />
      <div className="dashboard-grid">
        <RecentDocuments />
        <PendingSignatures />
      </div>
    </div>
  );
};

export default Dashboard;
