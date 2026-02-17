import { test, expect } from '@playwright/test';

test('should add a new entry to the table after form submission', async ({ page }) => {
  // 1. Navigate to your local Vite dev server
  await page.goto('http://localhost:5173/');

  // 2. Click the "Add User" button to open the form/modal
  await page.getByRole('button', { name: /add/i }).click();

  // 3. Fill out the form fields
  await page.getByRole('textbox',{name: /title/i}).fill('test title 123');
  await page.getByRole('textbox',{name: /description/i}).fill('test description');

  // 4. Submit the form
  await page.getByRole('button', { name: 'Add Task' }).click();

  // 5. Verification: Check the table for the new entry
  const table = page.getByRole('grid');
  const newRow = table.getByRole('gridcell', { name: 'test title' });
  
  // Assert that the row is visible and contains the correct data
  await expect(table).toBeVisible();
  await expect(newRow).toBeVisible();
  await expect(newRow).toContainText('test title 123');
});