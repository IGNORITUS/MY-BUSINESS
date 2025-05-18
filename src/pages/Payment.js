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
  Alert
} from '@mui/material';
import {
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  LocalAtm as CashIcon,
  Security as SecurityIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const Payment = () => {
  const paymentMethods = [
    {
      title: 'Банковской картой',
      icon: <CardIcon color="primary" />,
      description: 'Оплата картами Visa, MasterCard, МИР',
      features: [
        'Безопасная оплата через защищенное соединение',
        'Мгновенное подтверждение платежа',
        'Возможность оплаты в рассрочку',
        'Поддержка 3D Secure'
      ]
    },
    {
      title: 'Банковским переводом',
      icon: <BankIcon color="primary" />,
      description: 'Оплата по реквизитам через интернет-банк',
      features: [
        'Оплата через любой банк',
        'Возможность оплаты с корпоративного счета',
        'Подробная инструкция по оплате',
        'Подтверждение платежа в течение 1-2 дней'
      ]
    },
    {
      title: 'Наличными при получении',
      icon: <CashIcon color="primary" />,
      description: 'Оплата наличными курьеру или в пункте выдачи',
      features: [
        'Оплата при получении заказа',
        'Возможность проверки товара перед оплатой',
        'Выдача кассового чека',
        'Доступно при курьерской доставке и в пунктах выдачи'
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Способы оплаты
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Доступные способы оплаты
        </Typography>
        <Typography paragraph>
          Мы предлагаем несколько удобных способов оплаты, чтобы вы могли выбрать наиболее подходящий вариант.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {paymentMethods.map((method, index) => (
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Безопасность платежей
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="h6" gutterBottom>
                Защита данных
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Все платежи обрабатываются через защищенное SSL-соединение" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Мы не храним данные вашей банковской карты" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
              <Typography variant="h6" gutterBottom>
                Подтверждение платежа
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Мгновенное подтверждение для оплаты картой" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Email-уведомление о статусе платежа" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Alert severity="warning" sx={{ mt: 4 }}>
          <Typography variant="subtitle2" gutterBottom>
            Важная информация:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" />
              </ListItemIcon>
              <ListItemText 
                primary="При оплате картой убедитесь, что у вас достаточно средств"
                secondary="В случае отказа в оплате, заказ будет отменен"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" />
              </ListItemIcon>
              <ListItemText 
                primary="При оплате наличными подготовьте точную сумму"
                secondary="Курьер может не иметь сдачи"
              />
            </ListItem>
          </List>
        </Alert>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Контакты для вопросов по оплате
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Телефон"
                secondary="+7 (999) 123-45-67"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Email"
                secondary="payment@example.com"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Время работы службы поддержки"
                secondary="Пн-Вс: 9:00 - 21:00"
              />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default Payment; 