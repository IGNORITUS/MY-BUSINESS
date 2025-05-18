import React from 'react';
import { Link } from 'react-router-dom';
import { FaVk, FaInstagram, FaFacebookF } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer premium-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section brand">
            <h3 className="footer-logo">LuvBoxPrime</h3>
            <p className="footer-desc">Ваш надежный партнёр в мире премиальных подарков.</p>
          </div>

          <div className="footer-section links">
            <h4>Навигация</h4>
            <Link to="/">Главная</Link>
            <Link to="/about">О нас</Link>
            <Link to="/catalog">Каталог</Link>
            <Link to="/contact">Контакты</Link>
          </div>

          <div className="footer-section contacts">
            <h4>Контакты</h4>
            <p>Email: <a href="mailto:info@luvboxprime.ru">info@luvboxprime.ru</a></p>
            <p>Телефон: <a href="tel:+79991234567">+7 (999) 123-45-67</a></p>
            <p>Адрес: г. Москва, ул. Примерная, д. 123</p>
          </div>

          <div className="footer-section social">
            <h4>Мы в соцсетях</h4>
            <div className="social-links">
              <a href="https://vk.com" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте"><FaVk /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} LuvBoxPrime. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 