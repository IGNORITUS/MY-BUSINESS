import React, { useState, useEffect } from 'react';
import { Box, Grid, Container, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 1000],
    popularity: '',
    availability: ''
  });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Fetch products with filters and sorting
    fetchProducts();
  }, [filters, sortBy]);

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        sortBy
      });
      const response = await fetch(`/api/products?${queryParams}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', gap: 2, py: 4 }}>
        <FilterSidebar filters={filters} setFilters={setFilters} />
        
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Products</Typography>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                <MenuItem value="popularity">Popularity</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductCatalog; 