import Products from '../TestValues.json';
import Brands from '../TestValues.json';
import Sellers from '../TestValues.json';
import Grid from '@mui/material/Grid';
import { ProductGrid } from './ProductGrid';
import { SideNav } from './SideNav';
import { useState } from 'react';

// Encapsulates both SideNav and ProductGrid
export const ProductPage = (props) => {

  const [products, setProducts] = useState(Products.products);
  let [filters] = useState(
    { 
      brands: [], 
      sellers: [], 
      lowestPrice: null, 
      highestPrice: null
    }
  );

  const filterProducts = () => {
    // Filter products that are within price range, and don't belong to brands or sellers arrays
    setProducts(Products.products.filter(product => (
      (filters.lowestPrice ? (product.price >= filters.lowestPrice) : true)
      && (filters.highestPrice ? (product.price <= filters.highestPrice) : true)
      && !filters.brands.includes(product.brand)
      && !filters.sellers.includes(product.seller)
    )));
  }

  const onSliderChange = (priceRange) => {
    // Set price range from slider
    filters.lowestPrice = priceRange[0];
    filters.highestPrice = priceRange[1];

    // Update product state with filters
    filterProducts();
  }

  const onCheckboxChange = (filterType, filterName, isChecked) => {
    // Unchecked checkbox -> Add filter to filters state
    if (!isChecked) {
      if (filterType === 'Brand') {
        filters.brands.push(filterName);
      }
      else if (filterType === 'Seller') {
        filters.sellers.push(filterName);
      }
    }
    // Checked checkbox -> Remove filter from filters state
    else {
      if (filterType === 'Brand') {
        filters.brands = filters.brands.filter((f) => f !== filterName);
      }
      else if (filterType === 'Seller') {
        filters.sellers = filters.sellers.filter((f) => f !== filterName);
      }
    }

    // Update product state with filters
    filterProducts();
  }

  return (
    <Grid container columnSpacing={4} rowSpacing={5}>
      <Grid item xs={12} md={3} lg={2}>
        <SideNav brands={Brands} sellers={Sellers} onCheckboxChange={onCheckboxChange} onSliderChange={onSliderChange} />
      </Grid>
      <Grid item xs={12} md={9} lg={10}>
        <ProductGrid products={products}/>
      </Grid>
    </Grid>
  );
}