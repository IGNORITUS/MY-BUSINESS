import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = (trackingId: string) => {
  ReactGA.initialize(trackingId);
};

// Track page views
export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

// Track events
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// Track user interactions
export const trackUserInteraction = (
  interactionType: string,
  details: Record<string, any>
) => {
  ReactGA.event({
    category: 'User Interaction',
    action: interactionType,
    ...details,
  });
};

// Track ecommerce events
export const trackEcommerceEvent = (
  eventName: string,
  ecommerceData: Record<string, any>
) => {
  ReactGA.event({
    category: 'Ecommerce',
    action: eventName,
    ...ecommerceData,
  });
};

// Track product views
export const trackProductView = (product: {
  id: string;
  name: string;
  price: number;
  category: string;
}) => {
  trackEcommerceEvent('view_item', {
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
      },
    ],
  });
};

// Track add to cart
export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  trackEcommerceEvent('add_to_cart', {
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  });
};

// Track purchase
export const trackPurchase = (order: {
  id: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}) => {
  trackEcommerceEvent('purchase', {
    transaction_id: order.id,
    value: order.total,
    items: order.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

// Track search
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('Search', 'search', searchTerm, resultsCount);
};

// Track filter usage
export const trackFilter = (filterType: string, filterValue: string) => {
  trackEvent('Filter', 'apply', `${filterType}: ${filterValue}`);
};

// Track user errors
export const trackError = (error: Error, context?: string) => {
  trackEvent('Error', error.name, context || error.message);
};

// Track performance metrics
export const trackPerformance = (metric: {
  name: string;
  value: number;
  rating?: string;
}) => {
  trackEvent('Performance', metric.name, metric.rating, metric.value);
};

// Track user engagement
export const trackEngagement = (
  engagementType: string,
  duration: number,
  details?: Record<string, any>
) => {
  trackEvent('Engagement', engagementType, JSON.stringify(details), duration);
};

// Track form interactions
export const trackFormInteraction = (
  formName: string,
  action: string,
  success: boolean
) => {
  trackEvent('Form', action, formName, success ? 1 : 0);
};

// Track user preferences
export const trackUserPreference = (
  preferenceType: string,
  value: string | boolean | number
) => {
  trackEvent('User Preference', preferenceType, String(value));
};

// Track social interactions
export const trackSocialInteraction = (
  network: string,
  action: string,
  target: string
) => {
  trackEvent('Social', action, `${network}: ${target}`);
};

// Track video interactions
export const trackVideoInteraction = (
  videoId: string,
  action: string,
  progress?: number
) => {
  trackEvent('Video', action, videoId, progress);
};

// Track outbound links
export const trackOutboundLink = (url: string) => {
  trackEvent('Outbound Link', 'click', url);
};

// Track scroll depth
export const trackScrollDepth = (depth: number) => {
  trackEvent('Scroll', 'depth', `${depth}%`);
};

// Track time on page
export const trackTimeOnPage = (seconds: number) => {
  trackEvent('Time on Page', 'duration', undefined, seconds);
}; 