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
      apiKey?: {
        id: string;
        keyHash: string;
        keyPrefix: string;
        keySuffix: string;
        name: string;
        userId: string;
        isActive: boolean;
        rateLimit: number;
        scopes: string[];
        expiresAt: string | null;
        revokedAt: string | null;
        createdAt: string;
        updatedAt: string;
        lastUsed: string | null;
      };
    }
  }
}

export {};
