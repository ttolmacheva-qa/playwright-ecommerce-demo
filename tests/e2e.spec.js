import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';

test.describe('E-commerce Cart & Checkout Flows', () => {
  let cartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
  });

  // Сценарий 1: Стандартный E2E UI тест (Покупка)
  test('Should complete purchase flow successfully via UI', async ({ page }) => {
    // 1. Идем на главную и добавляем товар
    await page.goto('/');
    const product = page.getByTestId('product-card').filter({ hasText: 'Wireless Headphones' });
    await product.getByRole('button', { name: 'Add to Cart' }).click();

    // 2. Убеждаемся, что появился бейдж успешного добавления
    await expect(page.getByTestId('success-toast')).toBeVisible();

    // 3. Переходим в корзину и проверяем товар
    await cartPage.goto();
    const items = await cartPage.getCartItemNames();
    expect(items).toContain('Wireless Headphones');

    // 4. Оформляем заказ
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*\/checkout/);
  });

  // Сценарий 2: Комбинированный тест (API + UI). Добавляем через API, проверяем в UI.
  // Показывает умение оптимизировать тесты и обходить UI там, где это не нужно проверять.
  test('Should display item in cart when added via API', async ({ page, request }) => {
    const productId = 'prod_12345';

    // 1. Добавляем товар в корзину через API-запрос
    const response = await request.post('/api/v1/cart/items', {
      data: {
        productId: productId,
        quantity: 1
      }
    });
    
    // Проверяем, что API отработал корректно
    expect(response.ok()).toBeTruthy();

    // 2. Открываем UI корзины (состояние должно подтянуться из сессии/кук)
    await cartPage.goto();

    // 3. Проверяем, что UI корректно отобразил данные с бекенда
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.totalPrice).not.toHaveText('$0.00');
  });

  // Сценарий 3: Перехват трафика (Mocking). Проверка обработки 500 ошибки фронтендом.
  test('Should display error message when checkout API fails (Mock 500 Error)', async ({ page }) => {
    // 1. Подготавливаем мок для API чекаута ДО того, как совершим действие
    await page.route('**/api/v1/checkout', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    // 2. Наполняем корзину (используем мок на стороне клиента для скорости)
    await page.goto('/cart');
    // Допустим, мы инжектим стейт через localStorage для демо-целей
    await page.evaluate(() => {
      localStorage.setItem('cart', JSON.stringify([{ id: 1, name: 'Demo Item', price: 10 }]));
    });
    await page.reload();

    // 3. Пытаемся оформить заказ
    await cartPage.proceedToCheckout();

    // 4. Проверяем, что фронтенд не упал, а показал красивую ошибку пользователю
    await expect(cartPage.errorMessage).toBeVisible();
    await expect(cartPage.errorMessage).toHaveText('Something went wrong. Please try again later.');
    
    // Убеждаемся, что мы не перешли на страницу оплаты
    await expect(page).not.toHaveURL(/.*\/checkout/);
  });
});