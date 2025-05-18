import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  // В реальном приложении здесь будет запрос к API для получения данных о продукте
  const product = {
    id: parseInt(id),
    name: 'Премиум бокс "Романтика"',
    price: '5 999 ₽',
    description: 'Изысканный подарочный бокс, созданный для особых моментов. Включает в себя премиальные товары, подобранные с любовью и вниманием к деталям.',
    image: 'https://via.placeholder.com/600x400',
    features: [
      'Премиальные материалы',
      'Индивидуальная упаковка',
      'Подарочная карточка',
      'Бесплатная доставка'
    ]
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    // Здесь будет логика добавления в корзину
    console.log('Added to cart:', { ...product, quantity });
  };

  const handleAddToFavorites = () => {
    // Здесь будет логика добавления в избранное
    console.log('Added to favorites:', product);
  };

  return (
    <div className="product-detail">
      <div className="product-container">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="product-price">{product.price}</div>
          
          <p className="product-description">{product.description}</p>
          
          <div className="product-features">
            <h3>Особенности:</h3>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          
          <div className="product-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Количество:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
            
            <button className="add-to-cart" onClick={handleAddToCart}>
              <FaShoppingCart /> Добавить в корзину
            </button>
            
            <button className="add-to-favorites" onClick={handleAddToFavorites}>
              <FaHeart /> В избранное
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 