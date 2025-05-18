import React from 'react';
import { motion } from 'framer-motion';
import { ProductSkeleton } from '../common/SkeletonLoader';

const ProductList = ({ products, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[...Array(6)].map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Товары не найдены
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-4"
        >
          <div className="flex items-start space-x-4">
            {/* Изображение */}
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover rounded"
              />
            </div>

            {/* Информация о товаре */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {product.description}
              </p>
              <div className="mt-2 flex items-center space-x-4">
                <span className="text-lg font-bold">
                  {product.price.toLocaleString('ru-RU')} ₽
                </span>
                {product.discount > 0 && (
                  <span className="text-sm text-red-500">
                    Скидка {product.discount}%
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  В наличии: {product.stock}
                </span>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(product)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(product.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductList; 