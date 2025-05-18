import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Profile from './pages/Profile';
import VerifyEmail from './pages/VerifyEmail';
import NotFound from './pages/NotFound';
import { checkAuth } from './store/slices/authSlice';
import { RootState } from './store';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { initGA } from './utils/analytics';
import SEO from './components/common/SEO';
import GoogleAnalytics from './components/analytics/GoogleAnalytics';
import NotificationSystem from './components/NotificationSystem';
import ErrorBoundary from './components/ErrorBoundary';
import { SecurityProvider } from './contexts/SecurityContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    // Инициализация Google Analytics
    initGA(process.env.REACT_APP_GA_MEASUREMENT_ID || '');
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SecurityProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                minHeight: '100vh'
              }}>
                <Header />
                <Box sx={{ flexGrow: 1 }}>
                  <NotificationSystem />
                  <GoogleAnalytics />
                  <Routes>
                    {/* Публичные маршруты */}
                    <Route
                      path="/auth"
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <Auth />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/verify-email"
                      element={
                        <ProtectedRoute requireAuth={true} requireVerified={false}>
                          <VerifyEmail />
                        </ProtectedRoute>
                      }
                    />

                    {/* Защищенные маршруты */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute requireAuth={true} requireVerified={true}>
                          <Home />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute requireAuth={true} requireVerified={true}>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                    {/* Новые маршруты */}
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/profile" element={<ProfilePage />} />

                    {/* 404 маршрут */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Box>
                <Footer />
              </Box>
            </Router>
          </ThemeProvider>
        </SecurityProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App; 