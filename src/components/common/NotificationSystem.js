import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Автоматически удаляем уведомление через 5 секунд
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <div className="notification-container" style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification ${notification.type}`}
            style={{
              padding: '10px 20px',
              marginBottom: '10px',
              borderRadius: '4px',
              backgroundColor: notification.type === 'error' ? '#ff4444' : 
                             notification.type === 'success' ? '#00C851' : 
                             notification.type === 'warning' ? '#ffbb33' : '#33b5e5',
              color: 'white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {notification.message}
            <button
              onClick={() => removeNotification(notification.id)}
              style={{
                marginLeft: '10px',
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </NotificationContext.Provider>
  );
};

const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export { useNotification }; 