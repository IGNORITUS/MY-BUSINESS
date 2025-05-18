describe('Product Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', '/api/products*').as('getProducts');
    cy.wait('@getProducts');
  });

  it('should display product list and handle filtering', () => {
    // Check if products are loaded
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);

    // Test search functionality
    cy.get('[data-testid="search-input"]').type('test product');
    cy.wait('@getProducts');
    cy.get('[data-testid="product-card"]').should('exist');

    // Test category filter
    cy.get('[data-testid="category-select"]').click();
    cy.get('[data-testid="category-option"]').first().click();
    cy.wait('@getProducts');
    cy.get('[data-testid="product-card"]').should('exist');

    // Test price filter
    cy.get('[data-testid="price-range"]').invoke('val', [0, 1000]);
    cy.wait('@getProducts');
    cy.get('[data-testid="product-card"]').should('exist');
  });

  it('should handle product details and add to cart', () => {
    // Click on first product
    cy.get('[data-testid="product-card"]').first().click();
    
    // Check product details
    cy.get('[data-testid="product-name"]').should('exist');
    cy.get('[data-testid="product-price"]').should('exist');
    cy.get('[data-testid="product-description"]').should('exist');

    // Add to cart
    cy.get('[data-testid="add-to-cart"]').click();
    cy.get('[data-testid="cart-count"]').should('have.text', '1');

    // Check cart
    cy.get('[data-testid="cart-icon"]').click();
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
  });

  it('should handle checkout process', () => {
    // Add product to cart
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();

    // Go to checkout
    cy.get('[data-testid="checkout-button"]').click();

    // Fill shipping information
    cy.get('[data-testid="shipping-form"]').within(() => {
      cy.get('[data-testid="name-input"]').type('John Doe');
      cy.get('[data-testid="email-input"]').type('john@example.com');
      cy.get('[data-testid="address-input"]').type('123 Main St');
      cy.get('[data-testid="city-input"]').type('New York');
      cy.get('[data-testid="zip-input"]').type('10001');
    });

    // Fill payment information
    cy.get('[data-testid="payment-form"]').within(() => {
      cy.get('[data-testid="card-number"]').type('4242424242424242');
      cy.get('[data-testid="expiry-date"]').type('1225');
      cy.get('[data-testid="cvc"]').type('123');
    });

    // Place order
    cy.get('[data-testid="place-order"]').click();
    cy.get('[data-testid="order-success"]').should('exist');
  });
}); 