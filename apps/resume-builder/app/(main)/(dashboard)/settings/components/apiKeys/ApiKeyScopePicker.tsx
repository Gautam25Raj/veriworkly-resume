import { Checkbox, Card } from "@veriworkly/ui";

import { API_KEY_SCOPE_OPTIONS } from "./ApiKeyScopes";

type ApiKeyScopePickerProps = {
  availableScopes: readonly string[];
  selectedScopes: string[];
  onChange: (value: string[]) => void;
};

export default function ApiKeyScopePicker({
  availableScopes,
  selectedScopes,
  onChange,
}: ApiKeyScopePickerProps) {
  const setScope = (scope: string, checked: boolean) => {
    if (checked) {
      onChange(Array.from(new Set([...selectedScopes, scope])));
      return;
    }

    onChange(selectedScopes.filter((value) => value !== scope));
  };

  return (
    <Card className="border-border/60 bg-background/30 p-4">
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Scopes</p>

          <p className="text-xs text-muted-foreground">
            Choose exactly what this key can do. Start with the least access possible.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {API_KEY_SCOPE_OPTIONS.filter((option) => availableScopes.includes(option.value)).map(
            (option) => (
              <label
                key={option.value}
                className="hover:border-accent/30 hover:bg-accent/5 flex cursor-pointer items-start gap-3 rounded-xl border border-border/70 px-3 py-3 text-sm transition-colors"
              >
                <Checkbox
                  checked={selectedScopes.includes(option.value)}
                  onCheckedChange={(checked) => setScope(option.value, Boolean(checked))}
                  className="mt-0.5"
                />

                <span className="min-w-0 space-y-0.5">
                  <span className="block font-medium text-foreground">{option.label}</span>

                  <span className="block text-xs leading-relaxed text-muted-foreground">
                    {option.description}
                  </span>
                </span>
              </label>
            ),
          )}
        </div>
      </div>
    </Card>
  );
}
