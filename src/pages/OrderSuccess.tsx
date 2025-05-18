import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EmailIcon from '@mui/icons-material/Email';

const SuccessContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const SuccessIcon = styled(CheckCircleIcon)(({ theme }) => ({
  fontSize: 80,
  color: theme.palette.success.main,
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  background: theme.palette.background.paper,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
}));

const OrderSuccess: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <SuccessContainer maxWidth="lg">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
      >
        <Box
          sx={{
            textAlign: 'center',
            mb: 6,
          }}
        >
          <motion.div variants={item}>
            <SuccessIcon />
          </motion.div>
          <motion.div variants={item}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Заказ успешно оформлен!
            </Typography>
          </motion.div>
          <motion.div variants={item}>
            <Typography variant="h6" color="text.secondary" paragraph>
              Спасибо за ваш заказ. Мы отправили подтверждение на вашу электронную почту.
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <motion.div variants={item}>
              <InfoCard>
                <IconWrapper>
                  <LocalShippingIcon />
                </IconWrapper>
                <Typography variant="h6" gutterBottom>
                  Отслеживание заказа
                </Typography>
                <Typography color="text.secondary">
                  Вы можете отслеживать статус вашего заказа в личном кабинете
                </Typography>
              </InfoCard>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div variants={item}>
              <InfoCard>
                <IconWrapper>
                  <EmailIcon />
                </IconWrapper>
                <Typography variant="h6" gutterBottom>
                  Подтверждение
                </Typography>
                <Typography color="text.secondary">
                  Мы отправили детали заказа на вашу электронную почту
                </Typography>
              </InfoCard>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div variants={item}>
              <InfoCard>
                <IconWrapper>
                  <CheckCircleIcon />
                </IconWrapper>
                <Typography variant="h6" gutterBottom>
                  Статус заказа
                </Typography>
                <Typography color="text.secondary">
                  Ваш заказ принят и находится в обработке
                </Typography>
              </InfoCard>
            </motion.div>
          </Grid>
        </Grid>

        <motion.div
          variants={item}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: theme.spacing(2),
          }}
        >
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/catalog')}
            sx={{
              borderRadius: 0,
              px: 4,
            }}
          >
            Продолжить покупки
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/profile/orders')}
            sx={{
              borderRadius: 0,
              px: 4,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
            }}
          >
            Мои заказы
          </Button>
        </motion.div>
      </motion.div>
    </SuccessContainer>
  );
};

export default OrderSuccess; 