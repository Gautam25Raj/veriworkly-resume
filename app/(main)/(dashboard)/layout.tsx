import type { ReactNode } from "react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Container } from "@/components/layout/Container";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col">
      <Navbar />

      <Container as="main" className="min-h-screen flex-1">
        {children}
      </Container>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
