import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Snackbar, Stack, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { removeNotification } from '../redux/slices/notificationSlice';
import type { Notification } from '../redux/slices/notificationSlice';

const NotificationContainer = styled(Stack)(({ theme }) => ({
  position: 'fixed',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: theme.zIndex.snackbar,
  maxWidth: 400,
  width: '100%',
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  width: '100%',
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  '& .MuiAlert-icon': {
    fontSize: 24,
  },
}));

const NotificationSystem: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const notifications = useSelector((state: any) => state.notification.notifications);

  useEffect(() => {
    notifications.forEach((notification: Notification) => {
      if (notification.duration) {
        setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.duration);
      }
    });
  }, [notifications, dispatch]);

  const getAlertColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <NotificationContainer spacing={1}>
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
          >
            <StyledAlert
              severity={notification.type}
              onClose={() => dispatch(removeNotification(notification.id))}
              sx={{
                borderLeft: `4px solid ${getAlertColor(notification.type)}`,
                '& .MuiAlert-message': {
                  width: '100%',
                },
              }}
            >
              {notification.title && (
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {notification.title}
                </div>
              )}
              {notification.message}
            </StyledAlert>
          </motion.div>
        ))}
      </AnimatePresence>
    </NotificationContainer>
  );
};

export default NotificationSystem; 