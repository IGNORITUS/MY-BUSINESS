import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>О компании LuvBoxPrime</h1>
          <p>Ваш надежный партнер в мире премиальных подарков</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission">
        <div className="container">
          <h2>Наша миссия</h2>
          <p>
            Мы стремимся сделать процесс выбора и покупки подарков максимально
            приятным и удобным. Наша цель — помочь вам найти идеальный подарок
            для ваших близких, который будет радовать их долгие годы.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="team">
        <div className="container">
          <h2>Наша команда</h2>
          <p>
            За нашими успехами стоит команда профессионалов, которые любят своё
            дело и стремятся сделать мир лучше через качественные подарки.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="values">
        <div className="container">
          <h2>Наши ценности</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Качество</h3>
              <p>
                Мы тщательно отбираем каждый товар в нашем каталоге, чтобы
                гарантировать высочайшее качество продукции.
              </p>
            </div>
            <div className="value-card">
              <h3>Надежность</h3>
              <p>
                Мы ценим доверие наших клиентов и делаем всё возможное, чтобы
                оправдать его.
              </p>
            </div>
            <div className="value-card">
              <h3>Инновации</h3>
              <p>
                Мы постоянно следим за новыми тенденциями и предлагаем
                актуальные решения.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact">
        <div className="container">
          <h2>Свяжитесь с нами</h2>
          <p>
            У вас есть вопросы или предложения? Мы всегда рады общению с нашими
            клиентами.
          </p>
          <div className="contact-info">
            <p>Email: info@luvboxprime.ru</p>
            <p>Телефон: +7 (999) 123-45-67</p>
            <p>Адрес: г. Москва, ул. Примерная, д. 123</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 