import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNotification } from '../../hooks/useNotification';
import { motion } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PromoCodes: React.FC = () => {
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState<Partial<PromoCode>>({
    code: '',
    type: 'percentage',
    value: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    usageLimit: 0,
    isActive: true,
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (promoCode?: PromoCode) => {
    if (promoCode) {
      setSelectedPromoCode(promoCode);
      setFormData(promoCode);
    } else {
      setSelectedPromoCode(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: 0,
        minOrderAmount: 0,
        maxDiscount: 0,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        usageLimit: 0,
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPromoCode(null);
    setFormData({
      code: '',
      type: 'percentage',
      value: 0,
      minOrderAmount: 0,
      maxDiscount: 0,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      usageLimit: 0,
      isActive: true,
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (selectedPromoCode) {
        await dispatch(updatePromoCode({ id: selectedPromoCode.id, ...formData }));
        showNotification('Промокод успешно обновлен', 'success');
      } else {
        await dispatch(createPromoCode(formData));
        showNotification('Промокод успешно создан', 'success');
      }
      handleCloseDialog();
    } catch (error) {
      showNotification('Произошла ошибка при сохранении промокода', 'error');
    }
  };

  const handleDeletePromoCode = async (promoCodeId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот промокод?')) {
      try {
        await dispatch(deletePromoCode(promoCodeId));
        showNotification('Промокод успешно удален', 'success');
      } catch (error) {
        showNotification('Произошла ошибка при удалении промокода', 'error');
      }
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Управление промокодами
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Добавить промокод
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Код</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Значение</TableCell>
              <TableCell>Мин. сумма</TableCell>
              <TableCell>Макс. скидка</TableCell>
              <TableCell>Использований</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promoCodes.map((promoCode) => (
              <TableRow key={promoCode.id}>
                <TableCell>{promoCode.code}</TableCell>
                <TableCell>
                  {promoCode.type === 'percentage' ? 'Процент' : 'Фиксированная сумма'}
                </TableCell>
                <TableCell>
                  {promoCode.type === 'percentage'
                    ? `${promoCode.value}%`
                    : `${promoCode.value} ₽`}
                </TableCell>
                <TableCell>{promoCode.minOrderAmount} ₽</TableCell>
                <TableCell>{promoCode.maxDiscount} ₽</TableCell>
                <TableCell>
                  {promoCode.usageCount} / {promoCode.usageLimit}
                </TableCell>
                <TableCell>
                  <Chip
                    label={promoCode.isActive ? 'Активен' : 'Неактивен'}
                    color={getStatusColor(promoCode.isActive)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(promoCode)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeletePromoCode(promoCode.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalPromoCodes}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPromoCode ? 'Редактировать промокод' : 'Добавить промокод'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Код"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Тип скидки</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Тип скидки"
                >
                  <MenuItem value="percentage">Процент</MenuItem>
                  <MenuItem value="fixed">Фиксированная сумма</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Значение"
                name="value"
                type="number"
                value={formData.value}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Минимальная сумма заказа"
                name="minOrderAmount"
                type="number"
                value={formData.minOrderAmount}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Максимальная скидка"
                name="maxDiscount"
                type="number"
                value={formData.maxDiscount}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Дата начала"
                  value={new Date(formData.startDate || '')}
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: date?.toISOString() || '',
                    }))
                  }
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Дата окончания"
                  value={new Date(formData.endDate || '')}
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: date?.toISOString() || '',
                    }))
                  }
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Лимит использований"
                name="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    name="isActive"
                  />
                }
                label="Активен"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedPromoCode ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PromoCodes; 