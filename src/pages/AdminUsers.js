import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { fetchUsers, updateUserRole } from '../store/slices/userSlice';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Pagination from '../components/Pagination';

const userRoles = {
  user: { label: 'Пользователь', color: 'default' },
  admin: { label: 'Администратор', color: 'primary' },
};

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { items: users, loading, error } = useSelector((state) => state.users);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      setSelectedUser(null);
    } catch {}
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={() => dispatch(fetchUsers())} />;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Управление пользователями
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Поиск пользователей"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Фамилия</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell>Дата регистрации</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.firstName || '-'}</TableCell>
                <TableCell>{user.lastName || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={userRoles[user.role].label}
                    color={userRoles[user.role].color}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => setSelectedUser(user)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(filteredUsers.length / itemsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>

      <Dialog open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)} maxWidth="sm" fullWidth>
        {selectedUser && (
          <>
            <DialogTitle>Информация о пользователе</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Основная информация
                  </Typography>
                  <Typography variant="body2">
                    Email: {selectedUser.email}
                  </Typography>
                  <Typography variant="body2">
                    Имя: {selectedUser.firstName || '-'}
                  </Typography>
                  <Typography variant="body2">
                    Фамилия: {selectedUser.lastName || '-'}
                  </Typography>
                  <Typography variant="body2">
                    Дата регистрации: {new Date(selectedUser.createdAt).toLocaleString()}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Роль пользователя</InputLabel>
                    <Select
                      value={selectedUser.role}
                      label="Роль пользователя"
                      onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
                    >
                      {Object.entries(userRoles).map(([value, { label }]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedUser(null)}>Закрыть</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default AdminUsers; 