import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { expect, test } from "@playwright/test";

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
for (const path of ["/", "/builder.html"]) {
  test(`the Docs link follows the selected language on ${path}`, async ({ page }) => {
    await page.route("http://hitotsu.test/**", (route) => {
      const pathname = new URL(route.request().url()).pathname;
      const file = join(process.cwd(), "site", pathname === "/" ? "index.html" : pathname);
      return route.fulfill({ body: readFileSync(file), contentType: types[file.slice(file.lastIndexOf("."))] ?? "application/octet-stream" });
    });
    await page.goto(`http://hitotsu.test${path}?lang=ja`);
    const docs = page.locator('[data-say="pageDocs"]');
    await expect(docs).toHaveText("ドキュメント");
    await expect(docs).toHaveAttribute("href", "docs/ja/index.html");
    await page.locator('[data-lang="en"]').click();
    await expect(docs).toHaveAttribute("href", "docs/index.html");
    await page.locator('[data-lang="ja"]').click();
    await docs.click();
    await expect(page).toHaveURL("http://hitotsu.test/docs/ja/index.html");
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  });
}
