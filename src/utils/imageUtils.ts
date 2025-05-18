export const getImagePath = (path: string): string => {
  // Если путь начинается с http, возвращаем как есть
  if (path.startsWith('http')) {
    return path;
  }
  
  // Если путь начинается с /, возвращаем как есть
  if (path.startsWith('/')) {
    return path;
  }
  
  // Иначе добавляем базовый путь к изображениям
  return `/images/${path}`;
};

export const getProductImagePath = (productId: string, imageName: string): string => {
  return getImagePath(`products/${productId}/${imageName}`);
};

export const getCategoryImagePath = (categoryId: string): string => {
  return getImagePath(`categories/${categoryId}.webp`);
};

export const getAvatarPath = (userId: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(userId)}&background=random&size=200`;
};

export const getPlaceholderPath = (type: 'product' | 'category' | 'avatar'): string => {
  const placeholders = {
    product: '/images/placeholders/placeholder-box.jpg',
    category: '/images/placeholders/category-placeholder.jpg',
    avatar: '/images/placeholders/avatar-placeholder.png',
  };
  
  return placeholders[type];
}; 