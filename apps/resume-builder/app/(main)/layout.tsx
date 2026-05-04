import type { ReactNode } from "react";

import { AuthInitializer } from "@/providers/auth-provider";

import { fetchCurrentUser } from "@/features/auth/services/current-user";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const user = await fetchCurrentUser();

  return (
    <>
      <AuthInitializer initialUser={user} />
      {children}
    </>
  );
};

export default MainLayout;
