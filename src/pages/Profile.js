import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { updateProfile, changePassword } from '../store/slices/authSlice';
import './Profile.css';

const validationSchema = Yup.object({
  firstName: Yup.string().required('Обязательное поле'),
  lastName: Yup.string().required('Обязательное поле'),
  email: Yup.string().email('Неверный формат email').required('Обязательное поле'),
  phone: Yup.string().required('Обязательное поле')
});

const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required('Обязательное поле'),
  newPassword: Yup.string()
    .min(6, 'Минимум 6 символов')
    .required('Обязательное поле'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Пароли должны совпадать')
    .required('Обязательное поле')
});

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [successMessage, setSuccessMessage] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSuccessMessage('');
  };

  const handleProfileSubmit = async (values) => {
    try {
      await dispatch(updateProfile(values)).unwrap();
      setSuccessMessage('Профиль успешно обновлен');
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handlePasswordSubmit = async (values) => {
    try {
      await dispatch(changePassword(values)).unwrap();
      setSuccessMessage('Пароль успешно изменен');
    } catch (err) {
      console.error('Failed to change password:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Пожалуйста, войдите в систему</h2>
          <p>Для просмотра профиля необходимо авторизоваться</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {user.firstName.charAt(0).toUpperCase()}
          </div>
          <h3>{user.firstName} {user.lastName}</h3>
        </div>
        
        <nav className="profile-nav">
          <button 
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Личные данные
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            История заказов
          </button>
          <button 
            className={activeTab === 'favorites' ? 'active' : ''}
            onClick={() => setActiveTab('favorites')}
          >
            Избранное
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            Настройки
          </button>
        </nav>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Личные данные</h2>
            <div className="profile-info">
              <div className="info-group">
                <label>Имя:</label>
                <p>{user.firstName} {user.lastName}</p>
              </div>
              <div className="info-group">
                <label>Email:</label>
                <p>{user.email}</p>
              </div>
              <div className="info-group">
                <label>Телефон:</label>
                <p>{user.phone || 'Не указан'}</p>
              </div>
              <div className="info-group">
                <label>Адрес:</label>
                <p>{user.address || 'Не указан'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="profile-section">
            <h2>История заказов</h2>
            {user.orders && user.orders.length > 0 ? (
              <div className="orders-list">
                {user.orders.map(order => (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <span className="order-number">Заказ #{order.id}</span>
                      <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
                      <span className={`order-status ${order.status}`}>{order.status}</span>
                    </div>
                    <div className="order-details">
                      <p>Сумма: {order.total} ₽</p>
                      <p>Товаров: {order.items.length}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-orders">У вас пока нет заказов</p>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="profile-section">
            <h2>Избранное</h2>
            {/* Здесь будет компонент избранных товаров */}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="profile-section">
            <h2>Настройки</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Изменить пароль</label>
                <input type="password" placeholder="Текущий пароль" />
                <input type="password" placeholder="Новый пароль" />
                <input type="password" placeholder="Подтвердите пароль" />
                <button className="save-button">Сохранить</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 