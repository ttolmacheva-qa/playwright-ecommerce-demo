# Playwright Test Automation Framework (E-commerce)

Демонстрационный фреймворк для автоматизации тестирования E-commerce платформы. Создан для демонстрации навыков автоматизации на JavaScript + Playwright.

## Стек технологий
* **Language:** JavaScript (ES6+)
* **Test Runner:** Playwright Test
* **Pattern:** Page Object Model (POM)
* **CI/CD:** GitHub Actions

## Реализованные сценарии
1. **End-to-End UI flow:** Добавление товара в корзину и переход к оформлению заказа полностью через пользовательский интерфейс.
2. **Hybrid (API + UI) flow:** Создание корзины и добавление товара напрямую через POST-запрос к API, с последующей проверкой корректности отображения данных в UI.
3. **Network Mocking (Error handling):** Перехват сетевого запроса к API оформления заказа (`page.route`), подмена ответа сервера на код `500 Internal Server Error` и проверка обработки этой ошибки интерфейсом.

## Как запустить локально

1. Клонировать репозиторий:
   ```bash
   git clone https://github.com/ttolmacheva-qa/playwright-ecommerce-demo.git
   ```
2. Установить зависимости:
   ```bash
   npm install
   ```
3. Установить браузеры Playwright:
   ```bash
   npx playwright install
   ```
4. Запустить тесты:
   ```bash
   npx playwright test
   ```
