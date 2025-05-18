import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Chip
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  LocalOffer as PriceIcon
} from '@mui/icons-material';

const Delivery = () => {
  const deliveryMethods = [
    {
      title: 'Курьерская доставка',
      icon: <ShippingIcon color="primary" />,
      description: 'Доставка курьером до двери в удобное для вас время',
      features: [
        'Доставка в день заказа при оформлении до 14:00',
        'Выбор временного интервала доставки',
        'Возможность оплаты при получении',
        'Бесплатная доставка при заказе от 5000 ₽'
      ],
      price: 'от 300 ₽',
      time: '1-2 дня'
    },
    {
      title: 'Пункты выдачи',
      icon: <LocationIcon color="primary" />,
      description: 'Самовывоз из пунктов выдачи в вашем городе',
      features: [
        'Более 1000 пунктов выдачи по России',
        'Бесплатный срок хранения 3 дня',
        'Возможность примерки перед оплатой',
        'Бесплатная доставка при заказе от 3000 ₽'
      ],
      price: 'от 200 ₽',
      time: '2-3 дня'
    },
    {
      title: 'Почтовая доставка',
      icon: <ShippingIcon color="primary" />,
      description: 'Доставка Почтой России в любой населенный пункт',
      features: [
        'Доставка в любой населенный пункт России',
        'Отслеживание посылки по трек-номеру',
        'Возможность оплаты при получении',
        'Бесплатная доставка при заказе от 10000 ₽'
      ],
      price: 'от 400 ₽',
      time: '5-14 дней'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Доставка
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Способы доставки
        </Typography>
        <Typography paragraph>
          Мы предлагаем несколько удобных способов доставки, чтобы вы могли выбрать наиболее подходящий вариант.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {deliveryMethods.map((method, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {method.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {method.title}
                    </Typography>
                  </Box>
                  <Typography color="text.secondary" paragraph>
                    {method.description}
                  </Typography>
                  <List dense>
                    {method.features.map((feature, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Chip
                      icon={<PriceIcon />}
                      label={`Стоимость: ${method.price}`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      icon={<TimeIcon />}
                      label={`Срок: ${method.time}`}
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Зоны доставки
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="h6" gutterBottom>
                Москва и Санкт-Петербург
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Доставка в день заказа при оформлении до 14:00" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Бесплатная доставка при заказе от 5000 ₽" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
              <Typography variant="h6" gutterBottom>
                Регионы России
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Доставка во все регионы России" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Бесплатная доставка при заказе от 10000 ₽" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="subtitle2" gutterBottom>
            Важная информация:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Сроки доставки могут быть увеличены в период праздников и распродаж"
                secondary="Рекомендуем оформлять заказы заранее"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="При получении заказа проверяйте комплектацию и целостность упаковки"
                secondary="В случае обнаружения дефектов, сообщите об этом курьеру"
              />
            </ListItem>
          </List>
        </Alert>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Контакты для вопросов по доставке
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Телефон"
                secondary="+7 (495) 123-45-67"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Email"
                secondary="delivery@example.com"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Время работы службы доставки"
                secondary="Пн-Вс: 9:00 - 21:00"
              />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default Delivery; 