import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import MobileNavigation from './MobileNavigation';
import Toast from './Toast';
import PageTransition from './PageTransition';
import { useSelector } from 'react-redux';

const Layout = ({ children }) => {
  const { toast } = useSelector((state) => state.ui);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: 4,
          mb: { xs: 7, md: 0 } // Отступ для мобильной навигации
        }}
      >
        <PageTransition>
          {children}
        </PageTransition>
      </Container>
      <Footer />
      <MobileNavigation />
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => {}}
      />
    </Box>
  );
};

export default Layout; 