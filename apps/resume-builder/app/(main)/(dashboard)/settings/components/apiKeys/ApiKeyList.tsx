import { ArrowRightLeft, Key, Loader2, Trash2 } from "lucide-react";

import { Badge, Button, Card } from "@veriworkly/ui";

import type { ApiKeyRecord } from "./ApiKeyTypes";
import { summarizeApiKeyScopes } from "./ApiKeyScopes";

type ApiKeyListProps = {
  keys: ApiKeyRecord[];
  loading: boolean;
  onRotate: (key: ApiKeyRecord) => void;
  onDelete: (key: ApiKeyRecord) => void;
};

export default function ApiKeyList({ keys, loading, onRotate, onDelete }: ApiKeyListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold tracking-wider text-muted-foreground/70 uppercase">
        Active Keys
      </h3>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent/50" />
        </div>
      ) : keys.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-accent/20 bg-accent/5 py-12 text-center">
          <Key className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />

          <p className="text-muted-foreground">No API keys found. Generate one to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {keys.map((key) => (
            <Card key={key.id} className="group p-4 transition-colors hover:border-accent/30">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="shrink-0 rounded-lg bg-accent/10 p-2 text-accent">
                    <Key className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-bold text-foreground">{key.name}</span>

                      <Badge className="py-0 text-[10px]">
                        {key.isActive ? "Active" : "Revoked"}
                      </Badge>
                    </div>

                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-mono">
                        {key.keyPrefix}...{key.keySuffix}
                      </span>

                      <span>•</span>

                      <span>
                        {key.scopes.length} scope{key.scopes.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {summarizeApiKeyScopes(key.scopes).map((scope) => (
                        <Badge
                          key={`${key.id}-${scope.label}`}
                          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                        >
                          {scope.label} {scope.access}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Created {new Date(key.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>
                        Expires{" "}
                        {key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : "never"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRotate(key)}
                    className="text-foreground hover:bg-accent/10 hover:text-accent"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(key)}
                    className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
