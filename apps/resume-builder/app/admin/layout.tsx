import type { ReactNode } from "react";

import AdminNavbar from "@/components/admin/AdminNavbar";

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(180,216,200,0.20),transparent_50%),linear-gradient(180deg,rgba(10,14,18,0.02)_0%,rgba(10,14,18,0)_45%)]">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
