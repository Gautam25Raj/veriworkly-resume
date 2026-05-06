export interface ApiKeyRecord {
  id: string;
  keyPrefix: string;
  keySuffix: string;
  name: string;
  isActive: boolean;
  rateLimit: number;
  scopes: string[];
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  lastUsed: string | null;
}

export interface GeneratedApiKeyRecord extends ApiKeyRecord {
  key: string;
}
