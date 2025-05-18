import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useInView } from 'react-intersection-observer';
import { RootState } from '../redux/store';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { useTranslation } from 'react-i18next';

const COLUMN_COUNT = 4;
const ROW_HEIGHT = 400;

const ProductList: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { products, loading, error, filters, pagination } = useSelector(
    (state: RootState) => state.products
  );

  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const fetchMoreProducts = useCallback(() => {
    if (inView && !loading && pagination.currentPage < pagination.totalPages) {
      dispatch(fetchProducts({
        ...filters,
        page: pagination.currentPage + 1
      }));
    }
  }, [dispatch, inView, loading, filters, pagination]);

  const Cell = useCallback(({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * COLUMN_COUNT + columnIndex;
    const product = products[index];

    if (!product) return null;

    return (
      <div style={style}>
        <ProductCard product={product} />
      </div>
    );
  }, [products]);

  const gridProps = useMemo(() => ({
    columnCount: COLUMN_COUNT,
    columnWidth: window.innerWidth / COLUMN_COUNT,
    height: window.innerHeight - 100,
    rowCount: Math.ceil(products.length / COLUMN_COUNT),
    rowHeight: ROW_HEIGHT,
    width: window.innerWidth,
  }), [products.length]);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="product-list">
      {loading && products.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <AutoSizer>
          {({ height, width }) => (
            <Grid
              {...gridProps}
              height={height}
              width={width}
            >
              {Cell}
            </Grid>
          )}
        </AutoSizer>
      )}
      
      <div ref={ref} style={{ height: '20px' }} />
      
      {loading && products.length > 0 && (
        <div className="loading-more">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default React.memo(ProductList); 