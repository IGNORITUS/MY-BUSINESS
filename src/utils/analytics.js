import ReactGA from 'react-ga4';

export const initGA = (measurementId) => {
  ReactGA.initialize(measurementId);
};

export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const trackEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label
  });
};

export const trackConversion = (conversionId, value) => {
  ReactGA.event({
    category: 'Conversion',
    action: 'Purchase',
    label: conversionId,
    value: value
  });
};

export const trackProductInteraction = (productId, productName, category, action) => {
  ReactGA.event({
    category: 'Product',
    action,
    label: productName,
    value: productId
  });
};

export const trackSearch = (searchTerm) => {
  ReactGA.event({
    category: 'Search',
    action: 'Search',
    label: searchTerm
  });
};

export const trackAddToCart = (productId, productName, quantity, price) => {
  ReactGA.event({
    category: 'Ecommerce',
    action: 'Add to Cart',
    label: productName,
    value: quantity,
    price: price
  });
};

export const trackCheckout = (orderId, value) => {
  ReactGA.event({
    category: 'Ecommerce',
    action: 'Checkout',
    label: orderId,
    value: value
  });
};

export const trackUserRegistration = (userId) => {
  ReactGA.event({
    category: 'User',
    action: 'Registration',
    label: userId
  });
};

export const trackUserLogin = (userId) => {
  ReactGA.event({
    category: 'User',
    action: 'Login',
    label: userId
  });
}; 