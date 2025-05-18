describe('Purchase Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('completes a purchase successfully', () => {
    // Поиск товара
    cy.get('[data-testid="search-input"]').type('телефон');
    cy.get('[data-testid="search-button"]').click();

    // Добавление товара в корзину
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart-button"]').click();

    // Переход в корзину
    cy.get('[data-testid="cart-icon"]').click();

    // Проверка содержимого корзины
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
    cy.get('[data-testid="cart-total"]').should('be.visible');

    // Переход к оформлению заказа
    cy.get('[data-testid="checkout-button"]').click();

    // Заполнение формы оформления заказа
    cy.get('[data-testid="name-input"]').type('Иван Иванов');
    cy.get('[data-testid="email-input"]').type('ivan@example.com');
    cy.get('[data-testid="phone-input"]').type('+7 (999) 123-45-67');
    cy.get('[data-testid="address-input"]').type('ул. Примерная, д. 1');

    // Выбор способа оплаты
    cy.get('[data-testid="payment-method"]').select('card');

    // Подтверждение заказа
    cy.get('[data-testid="submit-order"]').click();

    // Проверка успешного оформления
    cy.get('[data-testid="success-message"]').should('be.visible');
    cy.get('[data-testid="order-number"]').should('be.visible');
  });

  it('handles out of stock product', () => {
    // Поиск товара
    cy.get('[data-testid="search-input"]').type('распродажа');
    cy.get('[data-testid="search-button"]').click();

    // Попытка добавить товар в корзину
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart-button"]').should('be.disabled');
    cy.get('[data-testid="out-of-stock-message"]').should('be.visible');
  });

  it('validates checkout form', () => {
    // Добавление товара в корзину
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart-button"]').click();

    // Переход к оформлению заказа
    cy.get('[data-testid="cart-icon"]').click();
    cy.get('[data-testid="checkout-button"]').click();

    // Попытка отправить пустую форму
    cy.get('[data-testid="submit-order"]').click();

    // Проверка сообщений об ошибках
    cy.get('[data-testid="name-error"]').should('be.visible');
    cy.get('[data-testid="email-error"]').should('be.visible');
    cy.get('[data-testid="phone-error"]').should('be.visible');
    cy.get('[data-testid="address-error"]').should('be.visible');
  });
}); 