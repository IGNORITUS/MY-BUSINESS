import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import {
  Assignment as DocumentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const ReturnPolicy = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Политика возврата и обмена товаров
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Общие положения
        </Typography>
        <Typography paragraph>
          Настоящая политика возврата и обмена товаров разработана в соответствии с законодательством Российской Федерации и определяет порядок и условия возврата и обмена товаров, приобретенных в нашем магазине.
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          Согласно Закону "О защите прав потребителей" вы имеете право на возврат товара надлежащего качества в течение 14 дней с момента получения заказа.
        </Alert>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Условия возврата товара надлежащего качества
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Товар не был в употреблении"
              secondary="Сохранены товарный вид, потребительские свойства, пломбы, фабричные ярлыки"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DocumentIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Наличие документов"
              secondary="Имеется товарный или кассовый чек, а также документ, удостоверяющий личность"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ScheduleIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Срок возврата"
              secondary="14 дней с момента получения товара"
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          Товары, не подлежащие возврату
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CancelIcon color="error" />
            </ListItemIcon>
            <ListItemText 
              primary="Товары для профилактики и лечения заболеваний в домашних условиях"
              secondary="Предметы санитарии и гигиены из металла, резины, текстиля и других материалов"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CancelIcon color="error" />
            </ListItemIcon>
            <ListItemText 
              primary="Парфюмерно-косметические товары"
              secondary="Средства по уходу за кожей, волосами, ногтями"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CancelIcon color="error" />
            </ListItemIcon>
            <ListItemText 
              primary="Программное обеспечение"
              secondary="Компьютерные программы, базы данных, аудио- и видеозаписи"
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          Процедура возврата
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <DocumentIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="1. Заполните заявление на возврат"
              secondary="Скачайте форму заявления на сайте или получите в магазине"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ShippingIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="2. Отправьте товар"
              secondary="Упакуйте товар и отправьте его нам любым удобным способом"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PaymentIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="3. Получите возврат средств"
              secondary="Деньги будут возвращены в течение 3-10 рабочих дней"
            />
          </ListItem>
        </List>

        <Alert severity="warning" sx={{ mt: 4 }}>
          <Typography variant="subtitle2" gutterBottom>
            Важно знать:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" />
              </ListItemIcon>
              <ListItemText 
                primary="Расходы по возврату товара оплачивает покупатель"
                secondary="Исключение составляют случаи, когда продавец не предоставил полную информацию о товаре"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" />
              </ListItemIcon>
              <ListItemText 
                primary="Возврат денежных средств"
                secondary="Производится тем же способом, которым была произведена оплата"
              />
            </ListItem>
          </List>
        </Alert>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Контакты для возврата
          </Typography>
          <Typography paragraph>
            По всем вопросам, связанным с возвратом товара, обращайтесь в нашу службу поддержки:
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
                secondary="returns@example.com"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Адрес для возврата"
                secondary="г. Москва, ул. Ленина, д. 10"
              />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default ReturnPolicy; 