import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Support.css';

const SupportCenter = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSuccess(true);
      setIsSubmitting(false);
      setFormData({ name: '', email: '', category: '', message: '' });
      
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="support-center-container" lang={i18n.language}>
      {/* Floating background elements */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      
      <div className="support-center-content">
        {/* Glass title - perfectly centered */}
        <div className="title-center-wrapper">
          <h1 className="center-title-gradient">
            <span className="center-glass-text">{t('support')}</span>
          </h1>
          <p className="center-subtitle">{t('we_are_here_to_help')}</p>
        </div>

        {/* Centered glass form */}
        <form onSubmit={handleSubmit} className="center-glass-form">
          {isSuccess && (
            <div className="glass-success-message">✓ {t('message_sent_successfully')}</div>
          )}

          <div className="center-form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="center-glass-input"
              placeholder={t('your_name')}
            />
          </div>

          <div className="center-form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="center-glass-input"
              placeholder="name@example.com"
            />
          </div>

          <div className="center-form-group">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="center-glass-select"
            >
              <option value="" disabled hidden>{t('category')}</option>
              <option value="technical">{t('technical_support')}</option>
              <option value="feedback">{t('feedback')}</option>
              <option value="inquiry">{t('general_question')}</option>
            </select>
          </div>

          <div className="center-form-group">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="center-glass-textarea"
              placeholder={t('your_message')}
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="center-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="center-spinner"></div>
            ) : (
              t('send_message')
            )}
          </button>
        </form>
      </div>
      
      {/* Footer placed at bottom with matching spacing */}
      <div className="support-footer">
      </div>
    </div>
  );
};

export default SupportCenter;
