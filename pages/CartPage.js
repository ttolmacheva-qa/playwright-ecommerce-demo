/**
 * Класс для работы со страницей Корзины (Cart Page).
 */
export class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // Используем семантические локаторы и test-id (best practice Playwright)
    this.cartHeader = page.getByRole('heading', { name: 'Your Cart' });
    this.cartItems = page.getByTestId('cart-item');
    this.checkoutButton = page.getByRole('button', { name: 'Proceed to Checkout' });
    this.totalPrice = page.getByTestId('cart-total-price');
    this.emptyCartMessage = page.getByText('Your cart is empty');
    this.errorMessage = page.getByTestId('error-toast');
  }

  /**
   * Открывает страницу корзины.
   */
  async goto() {
    await this.page.goto('/cart');
    await this.cartHeader.waitFor({ state: 'visible' });
  }

  /**
   * Получает названия всех товаров в корзине.
   * @returns {Promise<string[]>} Массив названий товаров
   */
  async getCartItemNames() {
    // Ждем, пока элементы появятся, если корзина не пуста
    await this.cartItems.first().waitFor({ state: 'visible' });
    return this.cartItems.allInnerTexts();
  }

  /**
   * Инициирует процесс оформления заказа.
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Удаляет товар из корзины по его названию.
   * @param {string} productName 
   */
  async removeItemByName(productName) {
    const item = this.cartItems.filter({ hasText: productName });
    await item.getByRole('button', { name: 'Remove' }).click();
  }
}