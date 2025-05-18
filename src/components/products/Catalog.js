import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import { ProductSkeleton } from '../common/SkeletonLoader';
import { useNotification } from '../common/NotificationSystem';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      showNotification('error', 'Ошибка при загрузке категорий');
      setError(err.message);
    }
  };

  const handleFilterChange = async (filters) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        category: filters.category,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        sortBy: filters.sortBy,
        inStock: filters.inStock,
        onSale: filters.onSale
      });

      const response = await fetch(`/api/products?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      showNotification('error', 'Ошибка при загрузке товаров');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Фильтры */}
        <div className="w-full md:w-64 flex-shrink-0">
          <ProductFilters
            onFilterChange={handleFilterChange}
            categories={categories}
          />
        </div>

        {/* Список товаров */}
        <div className="flex-1">
          <AnimatePresence>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                {error}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map(product => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Catalog; 