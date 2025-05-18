import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(6, 0),
  marginTop: 'auto',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
  },
}));

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              О компании
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Мы предлагаем премиальные решения для вашего бизнеса, 
              сочетающие современный дизайн и передовые технологии.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <SocialIcon aria-label="facebook">
                <FacebookIcon />
              </SocialIcon>
              <SocialIcon aria-label="instagram">
                <InstagramIcon />
              </SocialIcon>
              <SocialIcon aria-label="twitter">
                <TwitterIcon />
              </SocialIcon>
              <SocialIcon aria-label="linkedin">
                <LinkedInIcon />
              </SocialIcon>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Контакты
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Адрес: г. Москва, ул. Примерная, д. 123
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Телефон: +7 (999) 123-45-67
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Email: info@example.com
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Информация
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FooterLink href="/about">О нас</FooterLink>
              <FooterLink href="/delivery">Доставка</FooterLink>
              <FooterLink href="/payment">Оплата</FooterLink>
              <FooterLink href="/privacy">Политика конфиденциальности</FooterLink>
              <FooterLink href="/terms">Условия использования</FooterLink>
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: 4,
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Ваша компания. Все права защищены.
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer; 