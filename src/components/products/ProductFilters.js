import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../../hooks/useDebounce';

const ProductFilters = ({ onFilterChange, categories }) => {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 1000000],
    sortBy: 'newest',
    inStock: false,
    onSale: false
  });

  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    onFilterChange(debouncedFilters);
  }, [debouncedFilters, onFilterChange]);

  const handleCategoryChange = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      category: categoryId
    }));
  };

  const handlePriceChange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };

  const handleSortChange = (sortBy) => {
    setFilters(prev => ({
      ...prev,
      sortBy
    }));
  };

  const handleCheckboxChange = (name) => {
    setFilters(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 bg-white rounded-lg shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4">Фильтры</h3>

      {/* Категории */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Категории</h4>
        <div className="space-y-2">
          {categories.map(category => (
            <motion.label
              key={category.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="form-radio text-blue-500"
              />
              <span>{category.name}</span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Цена */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Цена</h4>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange[1])}
            className="w-24 px-2 py-1 border rounded"
            placeholder="От"
          />
          <span>-</span>
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
            className="w-24 px-2 py-1 border rounded"
            placeholder="До"
          />
        </div>
      </div>

      {/* Сортировка */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Сортировка</h4>
        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Сначала новые</option>
          <option value="price_asc">По возрастанию цены</option>
          <option value="price_desc">По убыванию цены</option>
          <option value="popular">По популярности</option>
        </select>
      </div>

      {/* Дополнительные фильтры */}
      <div className="space-y-4">
        <motion.label
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={() => handleCheckboxChange('inStock')}
            className="form-checkbox text-blue-500"
          />
          <span>В наличии</span>
        </motion.label>

        <motion.label
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={() => handleCheckboxChange('onSale')}
            className="form-checkbox text-blue-500"
          />
          <span>Со скидкой</span>
        </motion.label>
      </div>

      {/* Кнопка сброса */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setFilters({
          category: '',
          priceRange: [0, 1000000],
          sortBy: 'newest',
          inStock: false,
          onSale: false
        })}
        className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
      >
        Сбросить фильтры
      </motion.button>
    </motion.div>
  );
};

export default ProductFilters; 