import React from 'react';
import {useState, useEffect} from 'react';
import { cookieAge } from './CookieAge';
import axios from 'axios';

import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {useCookies} from "react-cookie";

export const CartPage = () => {
    //Forces rerender of components on call
    const [state, setState] = useState(0);
    const forceUpdate = () => setState(state + 1);

    //Use cookie takes the cookie name as argument and returns the cartCookie object and the setCookie method
    const [cookies, setCookie, deleteCookie] = useCookies(["cart", "user"]);

    let [subtotal] = useState(0.00);
    let [GST] = useState(0.00);
    let [QST] = useState(0.00);
    let [total] = useState(0.00);
    const [alertVisible, setAlertVisible] = useState(false);

    // Refresh cart items in cookie on first CartPage render
    useEffect(() => {
        if (cookies.cart) {
            axios.get(process.env.REACT_APP_DB_CONNECTION + "/api/items/all")
            .then((response) => {
                // Remove deleted items from cart
                setCookie("cart", cookies.cart.filter((cartProduct) => {
                    return response.data.some((product) => {
                        return product.id === cartProduct.id;
                    })
                }), { maxAge: cookieAge });
    
                // Update cart items with new product data
                setCookie("cart", cookies.cart.map((cartProduct) => {
                    return Object.assign(cartProduct, response.data.find(product => (
                        product.id === cartProduct.id
                    )));
                }), { maxAge: cookieAge });
            });
        }
    }, []);

    const calculateCartTally = () => {
        //calculating subtotal of all items
        cookies.cart.forEach((item) => {
            subtotal += ((item.quantity) * (item.price));
        });

        //calculating taxes
        GST = subtotal * 0.05;
        QST = subtotal * 0.0975;

        //calculating total after tax
        total = subtotal + GST + QST;
    }

    const emptyCart = () => {
        deleteCookie('cart');
    }

    const placeOrder = () => {
        //Opening order placement alert
        setAlertVisible(true);
        window.scrollTo(0, 0);

        //Posting order to backend once place order has been clicked
        axios.post(process.env.REACT_APP_DB_CONNECTION + '/api/orders/create', {
            userId: cookies.user.user.id,
            itemIds: cookies.cart.map(product => {
                return product.id
            }),
            itemQuantities: cookies.cart.map(product => {
                return product.quantity
            }),
            totalPrice: total
        }, {
            headers: {
                'Authorization': `Bearer ${cookies.user.token}`
            }
        }).catch(err => {
            window.alert(
                err.response.data.error + ".\n" +
                (err.response.data.message ? err.response.data.message + "." : ""));
        });

        //Clearing cart
        emptyCart();
    }

    //Displays cart items breakdown
    const PriceBreakdown = () => {
        return (
            cookies.cart.map((item, index) => {
                return (
                    <Grid item xs={12} sx={{display: 'flex'}} key={index}>
                        <Grid item xs={6} sx={{overflowX: 'hidden'}}>
                            <p><em>{item.name}</em></p>
                        </Grid>
                        <Grid item xs={6} sx={{textAlign: 'right'}}>
                            <p>{item.quantity} x {item.price.toFixed(2)} Ɖ</p>
                        </Grid>
                    </Grid>
                );
            })
        )
    }

    const CartItem = () => {
        // Modify item's quantity in the cart cookie
        const modifyItemQuantity = (itemID, quantity) => {
            setCookie("cart", cookies.cart.map(product => {
                if (itemID === product.id) {
                    return {...product, quantity: quantity};
                }
                return product;
            }), { maxAge: cookieAge });
        }

        const incrementItem = item => {
            //Increment quantity, ensuring that quantity does not exceed number of items of product in backend (totalQuantity)
            if (item.quantity < item.totalQuantity) {
                modifyItemQuantity(item.id, item.quantity + 1);
            }
            forceUpdate();
        }

        const decreaseItem = item => {
            //Decrement quantity, ensuring that quantity has at least 1 item per product in the cart
            if (item.quantity > 1) {
                modifyItemQuantity(item.id, item.quantity - 1);
            }
            forceUpdate();
        }

        const removeItem = itemID => {
            //Creates new array containing every product in the cart except the one being removed
            setCookie("cart", cookies.cart.filter(product => product.id !== itemID), { maxAge: cookieAge });
            forceUpdate();
        }

        return (
            cookies.cart.map((item, index) => {
                    return (
                        <Grid container className="CartItem" key={index}>
                            {/*Item image*/}
                            <Grid item sm={1} md={2} sx={{position: 'relative'}}>
                                <img className="CartItemImage" src={item.picture} alt={item.name}/>
                            </Grid>
                            <Grid item xs={12} sm={10}>
                                <Grid item xs={12} lg={12} sx={{display: 'flex'}}>
                                    {/*Item Name*/}
                                    <Grid item sm={9} md={11}>
                                        <h3 style={{margin: '1rem 0'}}>{item.name}</h3>
                                    </Grid>

                                    {/*Remove item button*/}
                                    <Grid item xs={3} md={1} sx={{margin: 'auto', textAlign: 'center'}}>
                                        <Button className="Cart-CloseButton"
                                                onClick={() => removeItem(item.id)}>
                                            <CloseIcon/>
                                        </Button>
                                    </Grid>

                                </Grid>
                                <Grid item xs={12} className='CartText'>

                                    {/*Seller info*/}
                                    <Grid item xs={12} lg={3}>
                                        <h4 style={{margin: 0}}>Seller:</h4>
                                        <p style={{margin: '0.5rem 0'}}>{item.sellerName}</p>
                                    </Grid>

                                    {/*Brand info*/}
                                    <Grid item xs={12} lg={3}>
                                        <h4 style={{margin: 0}}>Brand:</h4>
                                        <p style={{margin: '0.5rem 0'}}>{item.brandName}</p>
                                    </Grid>

                                    {/*Price info*/}
                                    <Grid item xs={12} lg={3}>
                                        <h4 style={{margin: 0, fontSize: '24px'}}>Price: {item.price} Ɖ</h4>
                                    </Grid>

                                    {/*Quantity buttons*/}
                                    <Grid item xs={12} lg={3}>
                                        <div>
                                            <h4 className="Cart-Quantity">Quantity</h4>
                                            <Stack className="Cart-Quantity" direction="row" spacing={1}>
                                                <Button className="QuantityButtons-Shared PinkButtonContained"
                                                        variant="contained"
                                                        disabled={item.quantity <= 1}
                                                        onClick={() => decreaseItem(item)}>
                                                    <RemoveIcon/>
                                                </Button>
                                                <input className="inputne" disabled={true}
                                                       value={item.quantity}/>
                                                <Button className="QuantityButtons-Shared PinkButtonContained"
                                                        variant="contained"
                                                        disabled={item.quantity >= item.totalQuantity}
                                                        onClick={() => incrementItem(item)}>
                                                    <AddIcon/>
                                                </Button>
                                            </Stack>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    );
                }
            )
        )
    }
    
    //When cart is empty or has not yet been created, display message
    if (!cookies.cart || cookies.cart.length === 0) {
        return (
            <Grid container className="Cart-Container">
                <Collapse in={alertVisible} className="Cart-Alert">
                    <Alert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => setAlertVisible(false)}
                            >
                                <CloseIcon fontSize="inherit"/>
                            </IconButton>
                        }
                        sx={{mb: 2}}
                    >
                        Order has successfully been placed.
                    </Alert>
                </Collapse>
                <Grid item xs={12} sx={{paddingBottom: '1rem'}}>
                    <h1 className='TextPink'>My Shopping Cart</h1>
                </Grid>
                <Grid item container sx={{paddingBottom: '2rem'}}>
                    <Typography>
                        Cart is empty. Return to products page to add products to cart.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Link to="/" className='RoutingLink'>
                        <Button variant="text" className="ProductsBackButton">
                            <ArrowBackIosNewIcon/><h4>Return to products</h4>
                        </Button>
                    </Link>
                </Grid>
            </Grid>
        )
    }else if (!cookies.user) {
        return (
            <Grid container className="Cart-Container">
                <Grid item container sx={{paddingBottom: '2rem'}}>
                    <Typography>
                        Not logged in. Please log in before purchase.
                    </Typography>
                </Grid>
            </Grid>
        )
    }else if(cookies.user.user.role !== "CUSTOMER"){
        return (
            <Grid container className="Cart-Container">
                <Grid item container sx={{paddingBottom: '2rem'}}>
                    <Typography>
                        Sellers and Admins cannot check out only customers can.
                    </Typography>
                </Grid>
            </Grid>
        )
    }
    
    /* Cart is full */

    // Calculate cart total
    calculateCartTally();
    
    // Display products in cart
    return (
        <Grid container className="Cart-Container">
            <Collapse in={alertVisible} className="Cart-Alert">
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setAlertVisible(false)}
                        >
                            <CloseIcon fontSize="inherit"/>
                        </IconButton>
                    }
                    sx={{mb: 2}}
                >
                    Order has successfully been placed.
                </Alert>
            </Collapse>
            <Grid item xs={12} sx={{paddingBottom: '1rem'}}>
                <h1 className='TextPink'>My Shopping Cart</h1>
            </Grid>
            <Grid item container xs={12} lg={9} className="CartItemsContainer">
                <CartItem/>
            </Grid>
            <Grid item xs={3} className="Cart-SideBanner">
                <Grid item xs={12}>
                    <h3 className='TextGreen'>Subtotal</h3>
                    <PriceBreakdown/>
                    <hr/>
                    <h4 style={{margin: '1rem 0', textAlign: 'right'}}
                        className='TextGreen'> {subtotal.toFixed(2)} Ɖ
                    </h4>
                </Grid>
                <hr/>
                <Grid item xs={12}>
                    <h3 className='TextGreen'>Total</h3>
                </Grid>
                <Grid item xs={12} sx={{display: 'flex', marginTop: '2rem'}}>
                    <Grid item xs={6}>
                        <h5 style={{margin: 0}}>GST: 5.0%</h5>
                    </Grid>
                    <Grid item xs={6}>
                        <h5 style={{marginTop: 0, textAlign: 'right'}}>{GST.toFixed(2)} Ɖ</h5>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{display: 'flex', marginTop: 0}}>
                    <Grid item xs={6}>
                        <h5 style={{margin: 0}}>QST: 9.975%</h5>
                    </Grid>
                    <Grid item xs={6}>
                        <h5 style={{marginTop: 0, textAlign: 'right'}}>{QST.toFixed(2)} Ɖ</h5>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{display: 'flex', marginTop: 0}}>
                    <Grid item xs={6}>
                        <h5 style={{margin: 0}}>Shipping</h5>
                    </Grid>
                    <Grid item xs={6}>
                        <h5 style={{marginTop: 0, textAlign: 'right'}} className='TextGreen'><em>Free</em></h5>
                    </Grid>
                </Grid>
                <hr/>
                <Grid item xs={12}>
                    <h4 style={{margin: 0, textAlign: 'right'}}
                        className='TextPink'>{total.toFixed(2)} Ɖ</h4>
                </Grid>
                <Grid item xs={12} className="Cart-OrderButton">
                    <Button variant="contained" className="GreenButtonContained" onClick={placeOrder}
                            disabled={cookies.cart.length === 0}>
                        Place order
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Link to="/" className='RoutingLink'>
                    <Button variant="text" className="ProductsBackButton">
                        <ArrowBackIosNewIcon/><h4>Return to products</h4>
                    </Button>
                </Link>
            </Grid>
        </Grid>
    );
}


