import "express";

declare global {
  type AuthenticatedUser = {
    id: string;
    email: string | null;
    name: string | null;
  };

  namespace Express {
    interface Request {
      authUser?: AuthenticatedUser;
    }
  }
}

export {};
