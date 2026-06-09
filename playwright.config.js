import { defineConfig, devices } from '@playwright/test';

/**
 * Конфигурация Playwright
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  // Запускать тесты параллельно (ускоряет прогон)
  fullyParallel: true,
  // Запретить `test.only` на CI
  forbidOnly: !!process.env.CI,
  // 2 ретрая на CI для борьбы с flaky tests (мигающими тестами), локально без ретраев
  retries: process.env.CI ? 2 : 0,
  // Кол-во воркеров: на CI оптимально использовать доступные ядра, локально можно больше
  workers: process.env.CI ? 4 : undefined,
  // HTML репортер отлично подходит для просмотра результатов
  reporter: 'html',
  
  use: {
    // Базовый URL для относительной навигации (page.goto('/cart'))
    baseURL: 'https://ecommerce-demo-site.com',
    
    // Сбор трейсов только при падении теста (экономит место и время)
    trace: 'retain-on-failure',
    // Скриншоты при падении
    screenshot: 'only-on-failure',
    // Видео при падении (опционально, но круто для дебага на CI)
    video: 'retain-on-failure',
  },

  // Настройка проектов для кроссбраузерного тестирования
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // Можно раскомментировать для тестирования мобильной версии
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],
});