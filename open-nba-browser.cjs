const { chromium } = require("C:\\Users\\user\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\\playwright");

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.google.com/search?q=NBA", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  const consentButton = page
    .getByRole("button", { name: /accept all|agree|接受全部|我同意/i })
    .first();
  if (await consentButton.isVisible().catch(() => false)) {
    await consentButton.click();
  }

  const imagesButton = page
    .getByRole("link", { name: /images|圖片|图片/i })
    .first();
  if (await imagesButton.isVisible().catch(() => false)) {
    await imagesButton.click();
    await page.waitForLoadState("domcontentloaded");
  } else {
    await page.goto("https://www.google.com/search?tbm=isch&q=NBA", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
  }

  // Keep the process alive so the controlled browser remains open.
  await new Promise(() => {});
})();
