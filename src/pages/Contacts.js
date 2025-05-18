import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

const contactInfo = [
  {
    icon: <PhoneIcon />,
    title: 'Телефон',
    content: '+7 (999) 123-45-67',
    description: 'Ежедневно с 9:00 до 21:00',
  },
  {
    icon: <EmailIcon />,
    title: 'Email',
    content: 'info@example.com',
    description: 'Ответим в течение 24 часов',
  },
  {
    icon: <LocationIcon />,
    title: 'Адрес',
    content: 'г. Москва, ул. Примерная, д. 123',
    description: 'Ближайшее метро: Примерная',
  },
  {
    icon: <TimeIcon />,
    title: 'Режим работы',
    content: 'Пн-Пт: 9:00 - 21:00',
    description: 'Сб-Вс: 10:00 - 20:00',
  },
];

const Contacts = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Здесь будет логика отправки формы
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Контакты
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {info.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {info.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" gutterBottom>
                    {info.content}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {info.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Напишите нам
            </Typography>
            <Typography variant="body1" paragraph>
              Если у вас есть вопросы или предложения, заполните форму ниже, и мы
              свяжемся с вами в ближайшее время.
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Ваше имя"
                    name="name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Тема"
                    name="subject"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Сообщение"
                    name="message"
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                  >
                    Отправить сообщение
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Как нас найти
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 400,
                bgcolor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Здесь будет карта */}
              <Typography variant="body1" color="text.secondary">
                Карта будет добавлена позже
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Contacts; 