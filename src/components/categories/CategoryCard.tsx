import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';

interface CategoryCardProps {
  id: number;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  description,
  image,
  productCount
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${id}`);
  };

  return (
    <div className="category-card" onClick={handleClick}>
      <div className="category-image">
        <img src={image} alt={name} />
      </div>
      <div className="category-info">
        <h3 className="category-name">{name}</h3>
        <p className="category-description">{description}</p>
        <p className="category-count">
          {productCount} {productCount === 1 ? 'товар' : 'товаров'}
        </p>
      </div>
    </div>
  );
};

export default CategoryCard; 