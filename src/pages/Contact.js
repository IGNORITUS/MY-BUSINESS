import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Form submitted:', formData);
  };

  return (
    <div className="contact-page">
      <section className="hero">
        <div className="container">
          <h1>Свяжитесь с нами</h1>
          <p>Мы всегда рады ответить на ваши вопросы</p>
        </div>
      </section>

      <section className="contact-info">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <h3>Адрес</h3>
              <p>г. Москва, ул. Примерная, д. 123</p>
            </div>
            <div className="info-card">
              <h3>Телефон</h3>
              <p>+7 (999) 123-45-67</p>
            </div>
            <div className="info-card">
              <h3>Email</h3>
              <p>info@luvboxprime.ru</p>
            </div>
            <div className="info-card">
              <h3>Время работы</h3>
              <p>Пн-Пт: 9:00 - 18:00</p>
              <p>Сб-Вс: 10:00 - 16:00</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-form">
        <div className="container">
          <h2>Напишите нам</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Ваше имя</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Тема</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Сообщение</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Отправить сообщение
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact; 