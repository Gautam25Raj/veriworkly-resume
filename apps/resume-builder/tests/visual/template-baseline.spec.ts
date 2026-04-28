import { expect, test } from "@playwright/test";

const templateIds = ["modern", "minimal", "executive"] as const;

for (const templateId of templateIds) {
  test(`template baseline: ${templateId}`, async ({ page }) => {
    await page.goto(`/templates/${templateId}`);
    await page.waitForLoadState("networkidle");

    const previewRegion = page.getByRole("region", {
      name: /template preview/i,
    });

    await expect(previewRegion).toBeVisible();
    await expect(previewRegion).toHaveScreenshot(
      `template-${templateId}-baseline.png`,
      {
        maxDiffPixelRatio: 0.01,
      },
    );
  });
}
