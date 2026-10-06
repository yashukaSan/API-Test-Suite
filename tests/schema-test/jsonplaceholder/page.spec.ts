import { test, expect } from '@playwright/test';

test.describe('page layout check', async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://jsonplaceholder.typicode.com');
    })

    test('should have title - JSONPlaceholder', async({page})=>{
        await expect(page).toHaveTitle(/JSONPlaceholder/);
    })
})