import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../common/NotificationSystem';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      showNotification('error', 'Ошибка при загрузке товаров');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      showNotification('error', 'Ошибка при загрузке категорий');
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete product');

      setProducts(products.filter(p => p.id !== productId));
      showNotification('success', 'Товар успешно удален');
    } catch (error) {
      showNotification('error', 'Ошибка при удалении товара');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = isEditing 
        ? `/api/products/${selectedProduct.id}`
        : '/api/products';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save product');

      const savedProduct = await response.json();
      
      if (isEditing) {
        setProducts(products.map(p => 
          p.id === savedProduct.id ? savedProduct : p
        ));
        showNotification('success', 'Товар успешно обновлен');
      } else {
        setProducts([...products, savedProduct]);
        showNotification('success', 'Товар успешно добавлен');
      }

      setIsEditing(false);
      setSelectedProduct(null);
    } catch (error) {
      showNotification('error', 'Ошибка при сохранении товара');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Панель управления</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsEditing(false);
            setSelectedProduct(null);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Добавить товар
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Форма добавления/редактирования */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={isEditing ? 'edit' : 'add'}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Редактировать товар' : 'Добавить товар'}
              </h2>
              <ProductForm
                categories={categories}
                initialData={selectedProduct}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsEditing(false);
                  setSelectedProduct(null);
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Список товаров */}
        <div className="lg:col-span-2">
          <ProductList
            products={products}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 