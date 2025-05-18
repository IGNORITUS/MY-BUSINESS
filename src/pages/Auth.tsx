import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Email, Lock, Visibility, VisibilityOff, Google, Facebook } from '@mui/icons-material';
import { login, register } from '../store/slices/authSlice';
import { RootState } from '../store';
import './Auth.css';

// Styled components
const AuthContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const AuthPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: 480,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #2196f3, #4caf50)',
  },
}));

const SocialButton = styled(Button)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 500,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}));

// Validation schemas
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Неверный формат email')
    .required('Email обязателен'),
  password: Yup.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .required('Пароль обязателен'),
  rememberMe: Yup.boolean(),
});

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .required('Имя обязательно'),
  email: Yup.string()
    .email('Неверный формат email')
    .required('Email обязателен'),
  password: Yup.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .required('Пароль обязателен'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
    .required('Подтверждение пароля обязательно'),
});

// Animation variants
const formVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const Auth: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [serverFieldErrors, setServerFieldErrors] = useState<{ [key: string]: string }>({});
  const [serverGeneralError, setServerGeneralError] = useState<string | null>(null);

  // Password strength indicator
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const loginFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setServerFieldErrors({});
      setServerGeneralError(null);
      try {
        const response = await dispatch(login(values)).unwrap();
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from);
      } catch (error: any) {
        handleAuthError(error);
      }
    },
  });

  const registerFormik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setServerFieldErrors({});
      setServerGeneralError(null);
      try {
        await dispatch(register(values)).unwrap();
        setIsLogin(true);
        // Show success message
      } catch (error: any) {
        handleAuthError(error);
      }
    },
  });

  const handleAuthError = (error: any) => {
    if (error?.response?.data?.errors) {
      const fieldErrors: { [key: string]: string } = {};
      error.response.data.errors.forEach((err: any) => {
        if (err.param && err.msg) {
          fieldErrors[err.param] = err.msg;
        }
      });
      setServerFieldErrors(fieldErrors);
    } else if (error?.response?.data?.message) {
      setServerGeneralError(error.response.data.message);
    } else if (error?.message) {
      setServerGeneralError(error.message);
    } else {
      setServerGeneralError('An error occurred. Please try again later.');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
    registerFormik.handleChange(e);
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      // Implement social login logic
      console.log(`Logging in with ${provider}`);
    } catch (error) {
      handleAuthError(error);
    }
  };

  return (
    <AuthContainer maxWidth="sm">
      <Zoom in={true} style={{ transitionDelay: '100ms' }}>
        <AuthPaper elevation={3}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2196f3, #4caf50)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
              }}
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isLogin
                ? 'Sign in to access your account'
                : 'Join us to start shopping'}
            </Typography>
          </Box>

          <AnimatePresence mode="wait">
            {serverGeneralError && (
              <Fade in={true}>
                <Alert severity="error" sx={{ mb: 3 }}>
                  {serverGeneralError}
                </Alert>
              </Fade>
            )}

            {isLogin ? (
              <motion.form
                key="login"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={loginFormik.handleSubmit}
              >
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={loginFormik.values.email}
                  onChange={loginFormik.handleChange}
                  error={
                    (loginFormik.touched.email && Boolean(loginFormik.errors.email)) ||
                    Boolean(serverFieldErrors.email)
                  }
                  helperText={
                    (loginFormik.touched.email && loginFormik.errors.email) ||
                    serverFieldErrors.email
                  }
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                  error={
                    (loginFormik.touched.password && Boolean(loginFormik.errors.password)) ||
                    Boolean(serverFieldErrors.password)
                  }
                  helperText={
                    (loginFormik.touched.password && loginFormik.errors.password) ||
                    serverFieldErrors.password
                  }
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={loginFormik.values.rememberMe}
                      onChange={loginFormik.handleChange}
                      color="primary"
                    />
                  }
                  label="Remember me"
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #2196f3, #4caf50)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976d2, #388e3c)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    or continue with
                  </Typography>
                </Divider>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <SocialButton
                    variant="outlined"
                    startIcon={<Google />}
                    onClick={() => handleSocialLogin('google')}
                  >
                    Google
                  </SocialButton>
                  <SocialButton
                    variant="outlined"
                    startIcon={<Facebook />}
                    onClick={() => handleSocialLogin('facebook')}
                  >
                    Facebook
                  </SocialButton>
                </Box>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Button
                      color="primary"
                      onClick={() => setIsLogin(false)}
                      sx={{ textTransform: 'none' }}
                    >
                      Sign Up
                    </Button>
                  </Typography>
                </Box>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={registerFormik.handleSubmit}
              >
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={registerFormik.values.name}
                  onChange={registerFormik.handleChange}
                  error={
                    (registerFormik.touched.name && Boolean(registerFormik.errors.name)) ||
                    Boolean(serverFieldErrors.name)
                  }
                  helperText={
                    (registerFormik.touched.name && registerFormik.errors.name) ||
                    serverFieldErrors.name
                  }
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={registerFormik.values.email}
                  onChange={registerFormik.handleChange}
                  error={
                    (registerFormik.touched.email && Boolean(registerFormik.errors.email)) ||
                    Boolean(serverFieldErrors.email)
                  }
                  helperText={
                    (registerFormik.touched.email && registerFormik.errors.email) ||
                    serverFieldErrors.email
                  }
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={registerFormik.values.password}
                  onChange={handlePasswordChange}
                  error={
                    (registerFormik.touched.password && Boolean(registerFormik.errors.password)) ||
                    Boolean(serverFieldErrors.password)
                  }
                  helperText={
                    (registerFormik.touched.password && registerFormik.errors.password) ||
                    serverFieldErrors.password
                  }
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {!isLogin && (
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Password Strength
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <Box
                          key={level}
                          sx={{
                            flex: 1,
                            height: 4,
                            borderRadius: 1,
                            bgcolor: level <= passwordStrength ? 'success.main' : 'grey.200',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={registerFormik.values.confirmPassword}
                  onChange={registerFormik.handleChange}
                  error={
                    (registerFormik.touched.confirmPassword &&
                      Boolean(registerFormik.errors.confirmPassword)) ||
                    Boolean(serverFieldErrors.confirmPassword)
                  }
                  helperText={
                    (registerFormik.touched.confirmPassword &&
                      registerFormik.errors.confirmPassword) ||
                    serverFieldErrors.confirmPassword
                  }
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleToggleConfirmPassword} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #2196f3, #4caf50)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976d2, #388e3c)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Create Account'}
                </Button>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Button
                      color="primary"
                      onClick={() => setIsLogin(true)}
                      sx={{ textTransform: 'none' }}
                    >
                      Sign In
                    </Button>
                  </Typography>
                </Box>
              </motion.form>
            )}
          </AnimatePresence>
        </AuthPaper>
      </Zoom>
    </AuthContainer>
  );
};

export default Auth; 