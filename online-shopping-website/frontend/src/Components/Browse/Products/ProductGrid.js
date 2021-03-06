import propTypes from 'prop-types';
import Card from '@mui/material/Card';
import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import React from 'react';
import Stack from '@mui/material/Stack';
import {Link} from "react-router-dom";

const ProductPreview = (props) => {
    return (
        // Navigates to ProductDetails page on click
        <Link to={{
            pathname: `/${props.product.id}/${props.product.name}`,
            params: {props}
        }} className="RoutingLink">
            <ButtonBase sx={{width: '100%', height: '90%', textAlign: 'left', margin: 0, padding: 0, borderRadius: '15px'}}>
                <Card className="ProductContainer">
                    <Stack sx={{height: '100%'}} direction="column" justifyContent="space-between">
                        {/* Image */}
                        <Stack direction="row" justifyContent="center" sx={{textAlign: 'center'}}>
                            <img className="ProductImage" src={props.product.picture} alt={props.product.name}/>
                        </Stack>

                        {/* Product information */}
                        <div>
                            <h3>{props.product.name}</h3>
                            <p><strong>Brand:</strong> {props.product.brand.name}</p>
                            <p><strong>Sold by:</strong> {props.product.seller.sellerName}</p>
                        </div>

                        {/* Product price */}
                        <h4 className="ProductPrice">{props.product.price} Ɖ</h4>
                    </Stack>
                </Card>
            </ButtonBase>
        </Link>
    );
}

// Creates a Grid item with a ProductPreview for each product in inputted data. Sets element keys to product ids.
const iterateProducts = (data) => {
    return data.products.map(product => {
        return (
            <Grid item key={product.id} xs={12} md={6} xl={4}>
                <ProductPreview key={product.id} product={product}/>
            </Grid>
        );
    });
}

export const ProductGrid = (props) => {
    return (
        <Grid container spacing={5} rowSpacing={5}>
            {iterateProducts(props)}
        </Grid>
    );
}

// Check types of props
ProductPreview.propTypes = {
    product: propTypes.shape({
        id: propTypes.number,
        name: propTypes.string,
        picture: propTypes.string,
        brand: propTypes.object,
        seller: propTypes.object,
        price: propTypes.number,
    })
}