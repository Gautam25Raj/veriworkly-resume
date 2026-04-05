import type { ReactNode } from "react";

import { resumeRouteFontVariables } from "@/app/(main)/resume-route-fonts";

import { AuthInitializer } from "@/providers/auth-provider";
import { fetchCurrentUser } from "@/features/auth/services/current-user";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const user = await fetchCurrentUser();

  return (
    <div className={resumeRouteFontVariables}>
      <AuthInitializer initialUser={user} />
      {children}
    </div>
  );
};

export default MainLayout;
