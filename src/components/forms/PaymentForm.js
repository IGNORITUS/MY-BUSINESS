import React from 'react';
import { Field } from 'formik';
import {
  Grid,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Typography
} from '@mui/material';

const PaymentForm = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Field name="paymentMethod">
          {({ field }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">Способ оплаты</FormLabel>
              <RadioGroup {...field}>
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label="Банковская карта"
                />
                <FormControlLabel
                  value="yookassa"
                  control={<Radio />}
                  label="ЮKassa"
                />
              </RadioGroup>
            </FormControl>
          )}
        </Field>
      </Grid>

      {field.value === 'card' && (
        <>
          <Grid item xs={12}>
            <Field name="cardNumber">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  label="Номер карты"
                  fullWidth
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
          </Grid>

          <Grid item xs={12}>
            <Field name="cardName">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  label="Имя на карте"
                  fullWidth
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Field name="expiryDate">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  label="Срок действия (ММ/ГГ)"
                  fullWidth
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Field name="cvv">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  label="CVV"
                  fullWidth
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
          </Grid>
        </>
      )}

      {field.value === 'yookassa' && (
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            После оформления заказа вы будете перенаправлены на страницу оплаты ЮKassa.
            Там вы сможете выбрать удобный способ оплаты.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default PaymentForm; 