import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

import DashboardWorkspace from "./components/DashboardWorkspace";

export const metadata: Metadata = {
  title: `Dashboard | ${siteConfig.name}`,
  description:
    "Manage your resumes, edit drafts, and export professional documents in seconds.",
  robots: { index: false, follow: false },
};

const DashboardPage = () => {
  return <DashboardWorkspace />;
};

export default DashboardPage;
