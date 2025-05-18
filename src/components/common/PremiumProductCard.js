import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PremiumProductCard = ({ product }) => {
  const {
    id,
    name,
    description,
    price,
    discount,
    images,
    stock,
  } = product;

  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative"
    >
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
          <motion.img
            src={images[0]}
            alt={name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          {discount > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              -{discount}%
            </div>
          )}
          {stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-lg font-medium">Нет в наличии</span>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
            {name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-lg font-medium text-gray-900">
                {discountedPrice.toLocaleString('ru-RU')} ₽
              </p>
              {discount > 0 && (
                <p className="text-sm text-gray-500 line-through">
                  {price.toLocaleString('ru-RU')} ₽
                </p>
              )}
            </div>
            {stock > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  // Add to cart logic here
                }}
              >
                В корзину
              </motion.button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PremiumProductCard; 