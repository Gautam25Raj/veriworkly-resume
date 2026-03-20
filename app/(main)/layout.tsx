import type { ReactNode } from "react";

import { resumeRouteFontVariables } from "@/app/(main)/resume-route-fonts";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return <div className={resumeRouteFontVariables}>{children}</div>;
};

export default MainLayout;
