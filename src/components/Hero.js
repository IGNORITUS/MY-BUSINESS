import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="premium-hero">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="title-line">Добро пожаловать в</span>
          <span className="title-highlight">LuvBoxPrime</span>
        </h1>
        <p className="hero-subtitle">
          Премиальные подарки для особенных моментов
        </p>
        <div className="hero-cta">
          <Link to="/catalog" className="cta-button primary">
            Смотреть каталог
          </Link>
          <Link to="/services" className="cta-button secondary">
            Наши услуги
          </Link>
        </div>
      </div>
      <div className="hero-background">
        <div className="hero-overlay"></div>
        <div className="hero-pattern"></div>
      </div>
    </section>
  );
};

export default Hero; 