import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const footerSections = [
    {
      title: 'О компании',
      links: [
        { text: 'О нас', path: '/about' },
        { text: 'Контакты', path: '/contacts' },
        { text: 'Вакансии', path: '/careers' },
        { text: 'Блог', path: '/blog' }
      ]
    },
    {
      title: 'Помощь',
      links: [
        { text: 'Доставка', path: '/delivery' },
        { text: 'Оплата', path: '/payment' },
        { text: 'Возврат', path: '/returns' },
        { text: 'FAQ', path: '/faq' }
      ]
    },
    {
      title: 'Информация',
      links: [
        { text: 'Политика конфиденциальности', path: '/privacy' },
        { text: 'Условия использования', path: '/terms' },
        { text: 'Публичная оферта', path: '/offer' },
        { text: 'Карта сайта', path: '/sitemap' }
      ]
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.primary.main,
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Информация о магазине */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              LuvBoxPrime
            </Typography>
            <Typography variant="body2" paragraph>
              Магазин уникальных бокс-наборов для подарков, праздников и особых случаев. Дарите эмоции вместе с нами!
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  +7 (495) 123-45-67
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  contact@example.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  г. Москва, ул. Ленина, д. 10
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Навигационные ссылки */}
          {footerSections.map((section) => (
            <Grid item xs={12} sm={6} md={2} key={section.title}>
              <Typography variant="h6" gutterBottom>
                {section.title}
              </Typography>
              {section.links.map((link) => (
                <Link
                  key={link.text}
                  component="button"
                  variant="body2"
                  onClick={() => navigate(link.path)}
                  sx={{
                    color: 'white',
                    display: 'block',
                    mb: 1,
                    textAlign: 'left',
                    '&:hover': {
                      color: theme.palette.secondary.main
                    }
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Grid>
          ))}

          {/* Социальные сети */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Мы в соцсетях
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                color="inherit"
                aria-label="Facebook"
                component="a"
                href="https://facebook.com"
                target="_blank"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="Twitter"
                component="a"
                href="https://twitter.com"
                target="_blank"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="Instagram"
                component="a"
                href="https://instagram.com"
                target="_blank"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="YouTube"
                component="a"
                href="https://youtube.com"
                target="_blank"
              >
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Нижняя часть футера */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} LuvBoxPrime. Все права защищены.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <img
              src="/images/payment/visa.png"
              alt="Visa"
              style={{ height: 24 }}
            />
            <img
              src="/images/payment/mastercard.png"
              alt="Mastercard"
              style={{ height: 24 }}
            />
            <img
              src="/images/payment/mir.png"
              alt="MIR"
              style={{ height: 24 }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 