import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToFavorites, removeFromFavorites } from '../store/slices/favoritesSlice';
import './Catalog.css';

const Catalog = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const favorites = useSelector(state => state.favorites.items);
  const cart = useSelector(state => state.cart.items);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке товаров');
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleToggleFavorite = (product) => {
    const isFavorite = favorites.some(item => item.id === product.id);
    if (isFavorite) {
      dispatch(removeFromFavorites(product.id));
    } else {
      dispatch(addToFavorites(product));
    }
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return <div className="catalog-loading"><div className="premium-spinner" /></div>;
  }

  if (error) {
    return <div className="catalog-error">{error}</div>;
  }

  return (
    <div className="catalog premium-catalog-bg">
      <div className="catalog-filters">
        <div className="category-filter">
          <h3>Категории</h3>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Все категории</option>
            <option value="electronics">Электроника</option>
            <option value="accessories">Аксессуары</option>
            <option value="gifts">Подарки</option>
          </select>
        </div>

        <div className="sort-filter">
          <h3>Сортировка</h3>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">По умолчанию</option>
            <option value="price-asc">По возрастанию цены</option>
            <option value="price-desc">По убыванию цены</option>
            <option value="name-asc">По названию (А-Я)</option>
            <option value="name-desc">По названию (Я-А)</option>
          </select>
        </div>
      </div>

      <div className="products-grid premium-products-grid">
        {sortedProducts.map(product => {
          const isFavorite = favorites.some(item => item.id === product.id);
          const isInCart = cart.some(item => item.id === product.id);

          return (
            <div key={product.id} className={`product-card premium-product-card${isInCart ? ' in-cart' : ''}`}>
              <div className="product-image-wrapper">
                <img src={product.image} alt={product.name} className="product-image" />
                {isFavorite && <span className="product-badge favorite">♥</span>}
                {isInCart && <span className="product-badge incart">В корзине</span>}
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">
                  {product.discountPrice ? (
                    <>
                      <span className="old-price">{product.price} ₽</span>
                      <span className="new-price">{product.discountPrice} ₽</span>
                    </>
                  ) : (
                    <span className="new-price">{product.price} ₽</span>
                  )}
                </p>
                <div className="product-actions">
                  <button 
                    className={`cart-btn premium-btn${isInCart ? ' in-cart' : ''}`}
                    onClick={() => handleAddToCart(product)}
                    disabled={isInCart}
                  >
                    {isInCart ? 'В корзине' : 'В корзину'}
                  </button>
                  <button 
                    className={`favorite-btn premium-btn${isFavorite ? ' active' : ''}`}
                    onClick={() => handleToggleFavorite(product)}
                    aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
                  >
                    <span className="favorite-icon">{isFavorite ? '♥' : '♡'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Catalog; 