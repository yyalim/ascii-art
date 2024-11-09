import { test, expect } from '@playwright/test';

// See here how to get started:
// https://playwright.dev/docs/intro
test('Sees lines added from uploaded text to page one by one', async ({ page }) => {
  await page.goto('/');

  page.locator('input[type="file"]').setInputFiles('./e2e/sample.txt')

  const numberInput = page.locator('input[type="number"]')
  await numberInput.fill('100')

  const submitButton = page.locator('input[type="submit"]')
  await submitButton.click()

  await expect(page.locator('pre')).toContainText('line1')
  await expect(page.locator('pre')).toContainText('line2')
  await expect(page.locator('pre')).toContainText('line5')
})
