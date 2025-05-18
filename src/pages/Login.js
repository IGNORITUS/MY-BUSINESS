import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Divider,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { login, register } from '../store/slices/authSlice';

const loginSchema = yup.object({
  email: yup.string().email('Неверный формат email').required('Обязательное поле'),
  password: yup.string().required('Обязательное поле'),
});

const registerSchema = yup.object({
  firstName: yup.string().required('Обязательное поле'),
  lastName: yup.string().required('Обязательное поле'),
  email: yup.string().email('Неверный формат email').required('Обязательное поле'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Обязательное поле'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Пароли должны совпадать').required('Обязательное поле'),
});

const resetSchema = yup.object({
  email: yup.string().email('Неверный формат email').required('Обязательное поле'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [tab, setTab] = useState(0);
  const [resetSent, setResetSent] = useState(false);

  const loginFormik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(login(values)).unwrap();
        navigate('/');
      } catch (error) {
        // Ошибка уже обработана в authSlice
      }
    },
  });

  const registerFormik = useFormik({
    initialValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        const { confirmPassword, ...userData } = values;
        await dispatch(register(userData)).unwrap();
        navigate('/');
      } catch (error) {
        // Ошибка уже обработана в authSlice
      }
    },
  });

  const resetFormik = useFormik({
    initialValues: { email: '' },
    validationSchema: resetSchema,
    onSubmit: async (values) => {
      setResetSent(true);
    },
  });

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {tab === 0 ? 'Вход' : tab === 1 ? 'Регистрация' : 'Восстановление пароля'}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {resetSent && tab === 2 && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Инструкции по восстановлению пароля отправлены на ваш email
          </Alert>
        )}
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setResetSent(false); }} variant="fullWidth" sx={{ mb: 3 }}>
          <Tab label="Вход" />
          <Tab label="Регистрация" />
          <Tab label="Восстановление" />
        </Tabs>
        {tab === 0 && (
          <form onSubmit={loginFormik.handleSubmit}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              value={loginFormik.values.email}
              onChange={loginFormik.handleChange}
              error={loginFormik.touched.email && Boolean(loginFormik.errors.email)}
              helperText={loginFormik.touched.email && loginFormik.errors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              value={loginFormik.values.password}
              onChange={loginFormik.handleChange}
              error={loginFormik.touched.password && Boolean(loginFormik.errors.password)}
              helperText={loginFormik.touched.password && loginFormik.errors.password}
              sx={{ mb: 3 }}
            />
            <Button fullWidth type="submit" variant="contained" color="primary" disabled={loading}>
              Войти
            </Button>
          </form>
        )}
        {tab === 1 && (
          <form onSubmit={registerFormik.handleSubmit}>
            <TextField
              fullWidth
              name="firstName"
              label="Имя"
              value={registerFormik.values.firstName}
              onChange={registerFormik.handleChange}
              error={registerFormik.touched.firstName && Boolean(registerFormik.errors.firstName)}
              helperText={registerFormik.touched.firstName && registerFormik.errors.firstName}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="lastName"
              label="Фамилия"
              value={registerFormik.values.lastName}
              onChange={registerFormik.handleChange}
              error={registerFormik.touched.lastName && Boolean(registerFormik.errors.lastName)}
              helperText={registerFormik.touched.lastName && registerFormik.errors.lastName}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="email"
              label="Email"
              value={registerFormik.values.email}
              onChange={registerFormik.handleChange}
              error={registerFormik.touched.email && Boolean(registerFormik.errors.email)}
              helperText={registerFormik.touched.email && registerFormik.errors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              value={registerFormik.values.password}
              onChange={registerFormik.handleChange}
              error={registerFormik.touched.password && Boolean(registerFormik.errors.password)}
              helperText={registerFormik.touched.password && registerFormik.errors.password}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="confirmPassword"
              label="Подтвердите пароль"
              type="password"
              value={registerFormik.values.confirmPassword}
              onChange={registerFormik.handleChange}
              error={registerFormik.touched.confirmPassword && Boolean(registerFormik.errors.confirmPassword)}
              helperText={registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword}
              sx={{ mb: 3 }}
            />
            <Button fullWidth type="submit" variant="contained" color="primary" disabled={loading}>
              Зарегистрироваться
            </Button>
          </form>
        )}
        {tab === 2 && (
          <form onSubmit={resetFormik.handleSubmit}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              value={resetFormik.values.email}
              onChange={resetFormik.handleChange}
              error={resetFormik.touched.email && Boolean(resetFormik.errors.email)}
              helperText={resetFormik.touched.email && resetFormik.errors.email}
              sx={{ mb: 3 }}
            />
            <Button fullWidth type="submit" variant="contained" color="primary" disabled={loading}>
              Восстановить пароль
            </Button>
          </form>
        )}
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">или</Typography>
        </Divider>
        <Box sx={{ textAlign: 'center' }}>
          <Link component={RouterLink} to="/" variant="body2" underline="hover">
            Вернуться на главную
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 