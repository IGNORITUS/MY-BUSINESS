import { useDispatch } from 'react-redux';
import { addNotification } from '../redux/slices/notificationSlice';
import type { NotificationType } from '../redux/slices/notificationSlice';

interface NotificationOptions {
  title?: string;
  duration?: number;
}

export const useNotification = () => {
  const dispatch = useDispatch();

  const showNotification = (
    type: NotificationType,
    message: string,
    options: NotificationOptions = {}
  ) => {
    dispatch(
      addNotification({
        type,
        message,
        title: options.title,
        duration: options.duration,
      })
    );
  };

  const success = (message: string, options?: NotificationOptions) => {
    showNotification('success', message, options);
  };

  const error = (message: string, options?: NotificationOptions) => {
    showNotification('error', message, options);
  };

  const info = (message: string, options?: NotificationOptions) => {
    showNotification('info', message, options);
  };

  const warning = (message: string, options?: NotificationOptions) => {
    showNotification('warning', message, options);
  };

  return {
    success,
    error,
    info,
    warning,
  };
};

export default useNotification; 