import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProductForm = ({ categories, initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    images: [],
    discount: '0'
  });

  const [imagePreview, setImagePreview] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        stock: initialData.stock || '',
        categoryId: initialData.categoryId || '',
        images: initialData.images || [],
        discount: initialData.discount || '0'
      });
      setImagePreview(initialData.images || []);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...data.urls]
      }));
      setImagePreview(prev => [...prev, ...data.urls]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Название */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Название товара
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Описание */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Описание
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Цена */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Цена
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Скидка */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Скидка (%)
        </label>
        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          min="0"
          max="100"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Количество */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Количество
        </label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          min="0"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Категория */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Категория
        </label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Выберите категорию</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Загрузка изображений */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Изображения
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full"
          disabled={uploading}
        />
        {uploading && (
          <div className="mt-2 text-sm text-gray-500">
            Загрузка изображений...
          </div>
        )}
      </div>

      {/* Предпросмотр изображений */}
      {imagePreview.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {imagePreview.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Кнопки */}
      <div className="flex justify-end space-x-4 mt-6">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Отмена
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {initialData ? 'Сохранить' : 'Добавить'}
        </motion.button>
      </div>
    </form>
  );
};

export default ProductForm; 