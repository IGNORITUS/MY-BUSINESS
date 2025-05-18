import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { addToCart } from '../../store/slices/cartSlice';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';
import OptimizedImage from '../common/OptimizedImage';
import { trackAddToCart, trackProductInteraction } from '../../utils/analytics';
import { useLanguage } from '../../contexts/LanguageContext';
import './ProductCard.css';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  onProductClick?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  image,
  category,
  stock,
  rating,
  onProductClick
}) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some(item => item.id === id);
  const { t } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({ id, name, price, image, quantity: 1 }));
    trackAddToCart(id, name, price);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromFavorites(id));
    } else {
      dispatch(addToFavorites({ id, name, price, image }));
    }
  };

  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(id);
      trackProductInteraction(id, 'View');
    }
  };

  return (
    <div className="product-card" onClick={handleProductClick}>
      <div className="product-image">
        <OptimizedImage
          src={image}
          alt={name}
          className="product-image-content"
        />
        <button
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-category">{category}</p>
        <div className="product-rating">
          {'★'.repeat(Math.floor(rating))}
          {'☆'.repeat(5 - Math.floor(rating))}
          <span className="rating-value">({rating.toFixed(1)})</span>
        </div>
        <p className="product-description">{description}</p>
        <div className="product-footer">
          <span className="product-price">{price.toLocaleString('ru-RU')} ₽</span>
          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={stock === 0}
          >
            {stock === 0 ? t('products.outOfStock') : t('products.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 