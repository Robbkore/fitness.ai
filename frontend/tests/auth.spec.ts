import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should navigate to login and register from landing', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Fitness.ai/);

        await page.click('text=Get Started');
        await expect(page).toHaveURL(/.*\/login/);

        await page.click('text=Sign up');
        await expect(page).toHaveURL(/.*\/register/);
    });

    // Note: Full E2E with backend will require setting up the Vite proxy
    // and having the backend running. This is a simple UI test for now.
    test('should display registration form elements', async ({ page }) => {
        await page.goto('/register');
        await expect(page.locator('input[name="name"]')).toBeVisible();
        await expect(page.locator('input[name="email"]')).toBeVisible();
        await expect(page.locator('input[name="password"]')).toBeVisible();
        await expect(page.locator('button:has-text("Create Account")')).toBeVisible();
    });
});
