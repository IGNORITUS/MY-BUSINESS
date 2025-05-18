// Валидация регистрации
export const validateRegistration = (values) => {
  const errors = {};

  if (!values.имя) {
    errors.имя = 'Имя обязательно';
  } else if (values.имя.length < 2) {
    errors.имя = 'Имя должно содержать минимум 2 символа';
  }

  if (!values.email) {
    errors.email = 'Email обязателен';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Некорректный email';
  }

  if (!values.пароль) {
    errors.пароль = 'Пароль обязателен';
  } else if (values.пароль.length < 6) {
    errors.пароль = 'Пароль должен содержать минимум 6 символов';
  }

  if (!values.подтверждение_пароля) {
    errors.подтверждение_пароля = 'Подтверждение пароля обязательно';
  } else if (values.пароль !== values.подтверждение_пароля) {
    errors.подтверждение_пароля = 'Пароли не совпадают';
  }

  return errors;
};

// Валидация входа
export const validateLogin = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Email обязателен';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Некорректный email';
  }

  if (!values.пароль) {
    errors.пароль = 'Пароль обязателен';
  }

  return errors;
};

// Валидация создания/редактирования товара
export const validateProduct = (values) => {
  const errors = {};

  if (!values.название) {
    errors.название = 'Название обязательно';
  } else if (values.название.length < 3) {
    errors.название = 'Название должно содержать минимум 3 символа';
  }

  if (!values.описание) {
    errors.описание = 'Описание обязательно';
  } else if (values.описание.length < 10) {
    errors.описание = 'Описание должно содержать минимум 10 символов';
  }

  if (!values.цена) {
    errors.цена = 'Цена обязательна';
  } else if (isNaN(values.цена) || values.цена <= 0) {
    errors.цена = 'Цена должна быть положительным числом';
  }

  if (!values.категория_id) {
    errors.категория_id = 'Категория обязательна';
  }

  if (!values.количество_на_складе) {
    errors.количество_на_складе = 'Количество на складе обязательно';
  } else if (isNaN(values.количество_на_складе) || values.количество_на_складе < 0) {
    errors.количество_на_складе = 'Количество должно быть неотрицательным числом';
  }

  return errors;
};

// Валидация создания заказа
export const validateOrder = (values) => {
  const errors = {};

  if (!values.адрес_доставки) {
    errors.адрес_доставки = 'Адрес доставки обязателен';
  }

  if (!values.способ_оплаты) {
    errors.способ_оплаты = 'Способ оплаты обязателен';
  }

  if (!values.товары || values.товары.length === 0) {
    errors.товары = 'Корзина пуста';
  }

  return errors;
};

// Валидация отзыва
export const validateReview = (values) => {
  const errors = {};

  if (!values.оценка) {
    errors.оценка = 'Оценка обязательна';
  } else if (isNaN(values.оценка) || values.оценка < 1 || values.оценка > 5) {
    errors.оценка = 'Оценка должна быть от 1 до 5';
  }

  if (!values.текст) {
    errors.текст = 'Текст отзыва обязателен';
  } else if (values.текст.length < 10) {
    errors.текст = 'Текст отзыва должен содержать минимум 10 символов';
  }

  return errors;
};

// Валидация профиля
export const validateProfile = (values) => {
  const errors = {};

  if (!values.имя) {
    errors.имя = 'Имя обязательно';
  } else if (values.имя.length < 2) {
    errors.имя = 'Имя должно содержать минимум 2 символа';
  }

  if (!values.email) {
    errors.email = 'Email обязателен';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Некорректный email';
  }

  return errors;
};

// Валидация изменения пароля
export const validatePasswordChange = (values) => {
  const errors = {};

  if (!values.текущий_пароль) {
    errors.текущий_пароль = 'Текущий пароль обязателен';
  }

  if (!values.новый_пароль) {
    errors.новый_пароль = 'Новый пароль обязателен';
  } else if (values.новый_пароль.length < 6) {
    errors.новый_пароль = 'Пароль должен содержать минимум 6 символов';
  }

  if (!values.подтверждение_пароля) {
    errors.подтверждение_пароля = 'Подтверждение пароля обязательно';
  } else if (values.новый_пароль !== values.подтверждение_пароля) {
    errors.подтверждение_пароля = 'Пароли не совпадают';
  }

  return errors;
}; 