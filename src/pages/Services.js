import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const services = [
    {
      title: 'Business Consulting',
      description: 'Expert advice to help your business grow and succeed.',
      icon: '📊',
    },
    {
      title: 'Digital Marketing',
      description: 'Comprehensive digital marketing solutions to boost your online presence.',
      icon: '📱',
    },
    {
      title: 'Web Development',
      description: 'Custom website development tailored to your business needs.',
      icon: '💻',
    },
    {
      title: 'SEO Optimization',
      description: 'Improve your search engine rankings and drive more traffic.',
      icon: '🔍',
    },
    {
      title: 'Content Creation',
      description: 'Engaging content that resonates with your target audience.',
      icon: '✍️',
    },
    {
      title: 'Social Media Management',
      description: 'Professional management of your social media presence.',
      icon: '📢',
    },
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <h1>Our Services</h1>
          <p>Discover how we can help your business grow</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section services-grid-section">
        <div className="container">
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section process">
        <div className="container">
          <div className="section-title">
            <h2>Our Process</h2>
            <p>How we work with our clients</p>
          </div>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Consultation</h3>
              <p>We begin with a thorough consultation to understand your needs.</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Planning</h3>
              <p>We develop a customized plan to achieve your goals.</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Implementation</h3>
              <p>We execute the plan with precision and attention to detail.</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h3>Results</h3>
              <p>We deliver measurable results and continuous support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Contact us today to discuss how we can help your business grow.</p>
            <Link to="/contact" className="btn btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services; 