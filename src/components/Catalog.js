import React from 'react';
import { Link } from 'react-router-dom';
import './Catalog.css';

const Catalog = () => {
  const products = [
    {
      id: 1,
      name: 'Премиум бокс "Романтика"',
      price: '5 999 ₽',
      image: 'https://via.placeholder.com/300x250',
      category: 'gift-boxes'
    },
    {
      id: 2,
      name: 'Бокс "Мужской характер"',
      price: '4 999 ₽',
      image: 'https://via.placeholder.com/300x250',
      category: 'for-him'
    },
    {
      id: 3,
      name: 'Бокс "Женская нежность"',
      price: '6 999 ₽',
      image: 'https://via.placeholder.com/300x250',
      category: 'for-her'
    },
    {
      id: 4,
      name: 'Бокс "Корпоративный"',
      price: '7 999 ₽',
      image: 'https://via.placeholder.com/300x250',
      category: 'gift-boxes'
    },
    {
      id: 5,
      name: 'Бокс "Праздничный"',
      price: '8 999 ₽',
      image: 'https://via.placeholder.com/300x250',
      category: 'gift-boxes'
    },
    {
      id: 6,
      name: 'Бокс "Для родителей"',
      price: '9 999 ₽',
      image: 'https://via.placeholder.com/300x250',
      category: 'gift-boxes'
    }
  ];

  return (
    <div className="catalog">
      <h1>Каталог</h1>
      <div className="catalog-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div 
              className="product-image" 
              style={{ backgroundImage: `url(${product.image})` }}
            />
            <h3>{product.name}</h3>
            <div className="product-price">{product.price}</div>
            <Link to={`/product/${product.id}`} className="product-link">
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog; 