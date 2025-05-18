import { z } from 'zod';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

// Схемы валидации
export const userSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z
    .string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .regex(/[A-Z]/, 'Пароль должен содержать заглавную букву')
    .regex(/[a-z]/, 'Пароль должен содержать строчную букву')
    .regex(/[0-9]/, 'Пароль должен содержать цифру')
    .regex(/[^A-Za-z0-9]/, 'Пароль должен содержать специальный символ'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

export const addressSchema = z.object({
  street: z.string().min(3, 'Минимум 3 символа'),
  city: z.string().min(2, 'Минимум 2 символа'),
  state: z.string().min(2, 'Минимум 2 символа'),
  zipCode: z.string().regex(/^\d{6}$/, 'Некорректный почтовый индекс'),
  country: z.string().min(2, 'Минимум 2 символа'),
});

export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, 'Некорректный номер карты')
    .transform((val) => val.replace(/\s/g, '')),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Некорректная дата')
    .transform((val) => {
      const [month, year] = val.split('/');
      return { month, year };
    }),
  cvv: z.string().regex(/^\d{3,4}$/, 'Некорректный CVV'),
  cardholderName: z.string().min(3, 'Минимум 3 символа'),
});

export const orderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().min(1, 'Минимум 1 товар'),
  })),
  deliveryMethod: z.string(),
  paymentMethod: z.string(),
  address: addressSchema,
  contactInfo: z.object({
    name: z.string().min(2, 'Минимум 2 символа'),
    phone: z.string().regex(/^\+?[1-9]\d{10,14}$/, 'Некорректный номер телефона'),
    email: z.string().email('Некорректный email'),
  }),
});

// Функции валидации
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { isValid: boolean; errors: Record<string, string> } => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path) {
          errors[err.path.join('.')] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { _form: 'Ошибка валидации' } };
  }
};

// Хелперы для валидации
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return /^\+?[1-9]\d{10,14}$/.test(phone);
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d{16}$/.test(cleaned)) return false;

  // Алгоритм Луна
  let sum = 0;
  for (let i = 0; i < cleaned.length; i++) {
    let digit = parseInt(cleaned[i]);
    if ((cleaned.length - i) % 2 === 0) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

export const validateExpiryDate = (expiryDate: string): boolean => {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) return false;

  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const expYear = parseInt(year);
  const expMonth = parseInt(month);

  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;

  return true;
};

// Форматирование данных
export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
};

export const formatExpiryDate = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  if (v.length >= 3) {
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
  }
  return value;
};

export const formatPhoneNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9+]/gi, '');
  if (v.startsWith('+')) {
    return `+${v.substring(1).replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5')}`;
  }
  return v.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
};

export const validateLogin = (data: LoginData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.email) {
    errors.email = 'Email обязателен';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
    errors.email = 'Некорректный формат email';
  }

  if (!data.password) {
    errors.password = 'Пароль обязателен';
  } else if (data.password.length < 6) {
    errors.password = 'Пароль должен содержать минимум 6 символов';
  }

  return errors;
};

export const validateRegistration = (data: RegisterData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.firstName) {
    errors.firstName = 'Имя обязательно';
  } else if (data.firstName.length < 2) {
    errors.firstName = 'Имя должно содержать минимум 2 символа';
  }

  if (!data.lastName) {
    errors.lastName = 'Фамилия обязательна';
  } else if (data.lastName.length < 2) {
    errors.lastName = 'Фамилия должна содержать минимум 2 символа';
  }

  if (!data.email) {
    errors.email = 'Email обязателен';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
    errors.email = 'Некорректный формат email';
  }

  if (!data.password) {
    errors.password = 'Пароль обязателен';
  } else if (data.password.length < 6) {
    errors.password = 'Пароль должен содержать минимум 6 символов';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Подтверждение пароля обязательно';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают';
  }

  if (data.phone && !/^\+?[1-9]\d{10,14}$/.test(data.phone)) {
    errors.phone = 'Некорректный формат номера телефона';
  }

  return errors;
}; 