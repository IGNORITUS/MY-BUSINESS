import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as OrderIcon,
  Info as SystemIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  fetchNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../store/slices/notificationSlice';

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications, unreadCount, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(getUnreadCount());
  }, [dispatch]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(fetchNotifications({ page: 1 }));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await dispatch(markAsRead(notification._id));
    }
    handleClose();
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllAsRead());
  };

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    await dispatch(deleteNotification(id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'comment':
        return <CommentIcon color="primary" />;
      case 'like':
        return <FavoriteIcon color="error" />;
      case 'order':
        return <OrderIcon color="success" />;
      default:
        return <SystemIcon color="info" />;
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 360, maxHeight: 480 }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Уведомления</Typography>
          {notifications.length > 0 && (
            <Button size="small" onClick={handleMarkAllAsRead}>
              Отметить все как прочитанные
            </Button>
          )}
        </Box>
        <Divider />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                py: 1.5,
                px: 2,
                backgroundColor: notification.read ? 'inherit' : 'action.hover'
              }}
            >
              <Box sx={{ mr: 2, mt: 0.5 }}>
                {getNotificationIcon(notification.type)}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">{notification.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(notification.createdAt), 'd MMMM yyyy, HH:mm', { locale: ru })}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={(e) => handleDelete(notification._id, e)}
                sx={{ ml: 1 }}
              >
                <SystemIcon fontSize="small" />
              </IconButton>
            </MenuItem>
          ))
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">Нет уведомлений</Typography>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default Notifications; 