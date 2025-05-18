import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNotification } from '../components/common/NotificationSystem';
import PageTransition from '../components/common/PageTransition';
import PremiumHeading from '../components/common/PremiumHeading';
import PremiumButton from '../components/common/PremiumButton';
import PremiumProductCard from '../components/common/PremiumProductCard';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotification();

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=3');
      if (!response.ok) throw new Error('Failed to fetch featured products');
      const data = await response.json();
      setFeaturedProducts(data);
    } catch (error) {
      addNotification('Ошибка при загрузке товаров', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <PageTransition>
      <div className="home">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <h1>Добро пожаловать в LuvBoxPrime</h1>
            <p>Премиальные подарки для особенных моментов</p>
            <Link to="/catalog" className="btn-primary">
              Смотреть каталог
            </Link>
          </div>
        </section>

        {/* Services Section */}
        <section className="section services">
          <div className="container">
            <div className="section-title">
              <h2>Наши услуги</h2>
              <p>Узнайте, что мы можем сделать для вашего бизнеса</p>
            </div>
            <div className="services-grid">
              <div className="service-card">
                <h3>Услуга 1</h3>
                <p>Описание услуги 1 и её преимущества.</p>
              </div>
              <div className="service-card">
                <h3>Услуга 2</h3>
                <p>Описание услуги 2 и её преимущества.</p>
              </div>
              <div className="service-card">
                <h3>Услуга 3</h3>
                <p>Описание услуги 3 и её преимущества.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="section about">
          <div className="container">
            <div className="about-content">
              <div className="about-text">
                <h2>О нас</h2>
                <p>
                  Мы — команда профессионалов, которые стремятся предоставить
                  лучшие решения для ваших бизнес-нужд. С многолетним опытом
                  в отрасли, мы знаем, что нужно для успеха.
                </p>
                <Link to="/about" className="btn btn-primary">
                  Узнать больше
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section contact">
          <div className="container">
            <div className="section-title">
              <h2>Свяжитесь с нами</h2>
              <p>Мы будем рады услышать от вас</p>
            </div>
            <div className="contact-content">
              <p>
                Готовы ли вы поднять свой бизнес на новый уровень? Свяжитесь с
                нами сегодня, чтобы обсудить, как мы можем помочь вам достичь
                своих целей.
              </p>
              <Link to="/contact" className="btn btn-primary">
                Связаться с нами
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <PremiumHeading
              title="Популярные товары"
              subtitle="Выбор наших покупателей"
            />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            >
              {featuredProducts.map((product) => (
                <PremiumProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <PremiumHeading
              title="Наши преимущества"
              subtitle="Почему выбирают нас"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16"
            >
              {[
                {
                  title: 'Быстрая доставка',
                  description: 'Доставляем заказы в течение 1-3 дней',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  ),
                },
                {
                  title: 'Гарантия качества',
                  description: 'Все товары проходят тщательную проверку',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                },
                {
                  title: 'Поддержка 24/7',
                  description: 'Наши специалисты всегда готовы помочь',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ),
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home; 