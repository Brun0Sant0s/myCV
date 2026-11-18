import { test, expect } from "@playwright/test";

// Quick check of the whole page before a deploy: it loads without errors, in both languages,
// the navigation reaches every section, and nothing is broken on a phone.
// The contact form is never really sent: EmailJS requests are blocked.

const watchErrors = (page) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    return errors;
};

test.beforeEach(async ({ page }) => {
    await page.route(/emailjs\.com/, (route) => route.abort());
});

test("desktop: loads in English and every tab reaches its section", async ({ page }) => {
    const errors = watchErrors(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("./");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toContainText("BRUNO");
    await expect(page.getByRole("link", { name: "See my projects" })).toBeVisible();

    const nav = page.getByRole("navigation", { name: "Sections" });
    for (const tab of ["About", "Experience", "Projects", "Certificates", "Contact"]) {
        const button = nav.getByRole("button", { name: new RegExp(tab) });
        await button.click();
        await expect(button).toHaveAttribute("aria-current", "page", { timeout: 10_000 });
    }

    await expect(page.locator("#projectsContent article")).toHaveCount(6);
    await expect(page.locator("#certificationsContent [role='tab']")).toHaveCount(5);
    expect(errors).toEqual([]);
});

test("Portuguese browser: opens in Portuguese, and the switch goes back to English", async ({ browser }) => {
    const context = await browser.newContext({ locale: "pt-PT", viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const errors = watchErrors(page);
    await page.goto("./");
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-PT");
    await expect(page.getByRole("link", { name: "Ver os meus projetos" })).toBeVisible();
    await page.getByRole("button", { name: /^Idioma/ }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(errors).toEqual([]);
    await context.close();
});

test("phone: no sideways scroll, readable form fields, folded features", async ({ browser }) => {
    const context = await browser.newContext({ locale: "en-US", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    const errors = watchErrors(page);
    await page.goto("./");

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    // iOS zooms into fields under 16px
    const sizes = await page.locator("#contactsContent input").evaluateAll((els) => els.map((e) => parseFloat(getComputedStyle(e).fontSize)));
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(16);

    const first = page.locator("#projectsContent article").first();
    const toggle = first.getByRole("button", { name: /Show features/ });
    await toggle.scrollIntoViewIfNeeded();
    await expect(first.locator("ul[id$='-features']")).toBeHidden();
    await toggle.click();
    await expect(first.locator("ul[id$='-features']")).toBeVisible();

    // Empty form: asks to fill in the fields, sends nothing
    const run = page.getByRole("button", { name: /Run/ });
    await run.scrollIntoViewIfNeeded();
    await run.click();
    await expect(page.getByText("Please fill in all fields.")).toBeVisible();

    expect(errors).toEqual([]);
    await context.close();
});

test("phone: file explorer, language and timeline years", async ({ browser }) => {
    const context = await browser.newContext({ locale: "en-US", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    const errors = watchErrors(page);
    await page.goto("./");

    // The open file opens the explorer, and every file in it reaches its section
    for (const file of ["About", "Experience", "Projects", "Certificates", "Contact"]) {
        await page.locator("[aria-controls='nav-explorer']").click();
        const button = page.locator("#nav-explorer").getByRole("button", { name: new RegExp(file) });
        await button.click();
        await page.locator("[aria-controls='nav-explorer']").click();
        await expect(page.locator("#nav-explorer").getByRole("button", { name: new RegExp(file) })).toHaveAttribute("aria-current", "page", {
            timeout: 10_000,
        });
        await page.keyboard.press("Escape");
    }

    // The language prop
    await page.getByRole("button", { name: /^Language/ }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-PT");
    await page.getByRole("button", { name: /^Idioma/ }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // Timeline: the latest year starts open; opening another year closes it
    const years = page.locator("#professionalExperienceContent button[aria-expanded]");
    await expect(years.first()).toHaveAttribute("aria-expanded", "true");
    const first = years.last();
    await first.scrollIntoViewIfNeeded();
    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(years.first()).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("Joined ePharma")).toBeVisible();

    expect(errors).toEqual([]);
    await context.close();
});
