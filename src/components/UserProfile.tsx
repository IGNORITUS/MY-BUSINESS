import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateProfile,
  changePassword,
  fetchUserOrders,
} from '../redux/slices/userSlice';
import { RootState } from '../redux/store';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const UserProfile: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, orders, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(profileData));
      setMessage({ type: 'success', text: t('profileUpdated') });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: t('passwordsDoNotMatch') });
      return;
    }
    try {
      await dispatch(changePassword(passwordData));
      setPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setMessage({ type: 'success', text: t('passwordChanged') });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
          >
            <Tab label={t('profile')} />
            <Tab label={t('orders')} />
            <Tab label={t('security')} />
          </Tabs>
        </Box>

        {message.text && (
          <Alert
            severity={message.type as 'success' | 'error'}
            sx={{ m: 2 }}
            onClose={() => setMessage({ type: '', text: '' })}
          >
            {message.text}
          </Alert>
        )}

        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleProfileSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('name')}
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('email')}
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('phone')}
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  {t('saveChanges')}
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <Typography>{t('loading')}</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : orders.length === 0 ? (
            <Typography>{t('noOrders')}</Typography>
          ) : (
            <List>
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h6" sx={{ mr: 2 }}>
                            {t('order')} #{order._id}
                          </Typography>
                          <Chip
                            label={t(order.status)}
                            color={getOrderStatusColor(order.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">
                            {t('total')}: ${order.totalAmount}
                          </Typography>
                        </>
                      }
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => window.location.href = `/orders/${order._id}`}
                    >
                      {t('viewDetails')}
                    </Button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setPasswordDialog(true)}
              >
                {t('changePassword')}
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>{t('changePassword')}</DialogTitle>
        <form onSubmit={handlePasswordSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label={t('currentPassword')}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label={t('newPassword')}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label={t('confirmPassword')}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialog(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {t('save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default UserProfile; 