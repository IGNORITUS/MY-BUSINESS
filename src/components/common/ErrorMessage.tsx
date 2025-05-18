import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onClose
}) => {
  return (
    <div className="error-message">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <p className="error-text">{message}</p>
      </div>
      <div className="error-actions">
        {onRetry && (
          <button className="error-button retry" onClick={onRetry}>
            Повторить
          </button>
        )}
        {onClose && (
          <button className="error-button close" onClick={onClose}>
            Закрыть
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 