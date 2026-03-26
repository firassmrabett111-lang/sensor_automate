import { test, expect } from '@playwright/test';

test.describe('Create flows', () => {
  test('creates a sensor via the UI and shows success toast', async ({ page }) => {
    await page.goto('/');

    // Open create sensor dialog
    await page.click('[data-testid="button-create-sensor"]');

    // Fill latitude / longitude (type default is 'air')
    await page.fill('[data-testid="input-latitude"]', '35.8256');
    await page.fill('[data-testid="input-longitude"]', '10.6406');

    // Submit
    await page.click('[data-testid="button-submit"]');

    // Expect a success toast to appear
    await expect(page.locator('text=Capteur créé').first()).toBeVisible({ timeout: 5000 });
  });

  test('creates an intervention via the UI (uses existing sensor) and shows success toast', async ({ page }) => {
    await page.goto('/');

    // Open create intervention dialog
    await page.click('[data-testid="button-create-intervention"]');

    // Wait for sensor select to be populated and select first option
    const sensorSelectTrigger = page.locator('[data-testid="select-sensor"]');
    await sensorSelectTrigger.click();

    // Select the first sensor item in the dropdown
    const firstSensorItem = page.locator('role=option').first();
    await firstSensorItem.click();

    // Add two technicians (if available)
    const addTechTrigger = page.locator('[data-testid="select-add-technician"]');
    await addTechTrigger.click();
    const firstTech = page.locator('role=option').first();
    await firstTech.click();
    // add second
    await addTechTrigger.click();
    await page.locator('role=option').nth(1).click();

    // Select a validator
    const validatorTrigger = page.locator('[data-testid="select-validator"]');
    await validatorTrigger.click();
    await page.locator('role=option').first().click();

    // Submit
    await page.click('[data-testid="button-submit"]');

    // Expect success toast
    await expect(page.locator('text=Intervention créée').first()).toBeVisible({ timeout: 5000 });
  });
});
