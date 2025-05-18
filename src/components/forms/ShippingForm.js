import React from 'react';
import { Field } from 'formik';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import './ShippingForm.css';

const countries = [
  { code: 'RU', name: 'Россия' },
  { code: 'KZ', name: 'Казахстан' },
  { code: 'BY', name: 'Беларусь' }
];

const ShippingForm = () => {
  return (
    <div className="shipping-form">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Field name="email">
            {({ field, meta }) => (
              <TextField
                {...field}
                fullWidth
                label="Электронная почта"
                type="email"
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
              />
            )}
          </Field>
        </Grid>

        <Grid item xs={12}>
          <Field name="phone">
            {({ field, meta }) => (
              <TextField
                {...field}
                fullWidth
                label="Телефон"
                type="tel"
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
              />
            )}
          </Field>
        </Grid>

        <Grid item xs={12}>
          <Field name="address">
            {({ field, meta }) => (
              <TextField
                {...field}
                fullWidth
                label="Адрес"
                multiline
                rows={3}
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
              />
            )}
          </Field>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Field name="firstName">
            {({ field, meta }) => (
              <TextField
                {...field}
                label="Имя"
                fullWidth
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
              />
            )}
          </Field>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Field name="lastName">
            {({ field, meta }) => (
              <TextField
                {...field}
                label="Фамилия"
                fullWidth
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
              />
            )}
          </Field>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Field name="city">
            {({ field, meta }) => (
              <TextField
                {...field}
                label="Город"
                fullWidth
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
              />
            )}
          </Field>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Field name="postalCode">
            {({ field, meta }) => (
              <TextField
                {...field}
                label="Почтовый индекс"
                fullWidth
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
              />
            )}
          </Field>
        </Grid>

        <Grid item xs={12}>
          <Field name="country">
            {({ field, meta }) => (
              <FormControl
                fullWidth
                error={meta.touched && Boolean(meta.error)}
              >
                <InputLabel>Страна</InputLabel>
                <Select
                  {...field}
                  label="Страна"
                >
                  {countries.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Field>
        </Grid>
      </Grid>
    </div>
  );
};

export default ShippingForm; 