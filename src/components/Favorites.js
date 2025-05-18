import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash } from 'react-icons/fa';
import './Favorites.css';

const Favorites = () => {
  // В реальном приложении здесь будет получение данных из Redux store
  const favorites = [
    {
      id: 1,
      name: 'Премиум бокс "Романтика"',
      price: '5 999 ₽',
      image: 'https://via.placeholder.com/300x250'
    },
    {
      id: 2,
      name: 'Бокс "Мужской характер"',
      price: '4 999 ₽',
      image: 'https://via.placeholder.com/300x250'
    },
    {
      id: 3,
      name: 'Бокс "Женская нежность"',
      price: '6 999 ₽',
      image: 'https://via.placeholder.com/300x250'
    }
  ];

  const handleRemoveFromFavorites = (id) => {
    // Здесь будет логика удаления из избранного
    console.log('Remove from favorites:', id);
  };

  return (
    <div className="favorites">
      <h1>Избранное</h1>
      
      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map(item => (
            <div key={item.id} className="favorite-item">
              <div 
                className="item-image" 
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="item-info">
                <h3>{item.name}</h3>
                <div className="item-price">{item.price}</div>
              </div>
              <div className="item-actions">
                <Link to={`/product/${item.id}`} className="view-item">
                  Подробнее
                </Link>
                <button 
                  className="remove-favorite"
                  onClick={() => handleRemoveFromFavorites(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-favorites">
          <FaHeart className="empty-icon" />
          <p>В избранном пока ничего нет</p>
          <Link to="/catalog" className="browse-catalog">
            Перейти в каталог
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites; 