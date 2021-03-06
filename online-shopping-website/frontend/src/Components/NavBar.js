import * as React from 'react';
import { cookieAge } from './Browse/CookieAge';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from "react-router-dom";
import navLogo from '../icons/BOBBLE-05.png';
import smallNavLogo from '../icons/BOBBLE-03.png';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import Typography from "@mui/material/Typography";

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export default function NavBar() {
    let navigator = useNavigate();

    const [cookies, setCookie, deleteCookie] = useCookies(['user', 'cart']);
    const [anchorEl, setAnchorEl] = React.useState(null);

    //initializing user credentials
    const [user, setUser] = React.useState({
        email: '',
        password: ''
    });

    const [openLogin, setOpenLogin] = React.useState(false);

    const handleLogout = () => {
        //Clearing user info on logout
        setUser({
            email: '',
            password: ''
        });

        // Delete user and cart cookies
        deleteCookie('user');
        deleteCookie('cart');

        navigator('/');
        window.location.reload();
    }

    const handleOpenLogin = () => {
        //open login form
        setOpenLogin(true);
    };

    const handleCloseLogin = () => {
        //close login form
        setOpenLogin(false);
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        try {
            const loginResponse = await axios.post(process.env.REACT_APP_DB_CONNECTION + "/api/users/signin", user);

            setCookie('user', loginResponse.data, {
                maxAge: cookieAge
            });

            // Close login popup
            setOpenLogin(false);
            setAnchorEl(false);

            // Route to products page
            navigator('/');
        }
        catch (err) {
            window.alert(
                err.response.data.error + ".\n" +
                (err.response.data.message ? err.response.data.message + "." : ""));
        }
    };

    const handleOpenUserMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorEl(null);
        if (!cookies.user) {
            setOpenLogin(true);
        }
    };

    const profileId = 'navbar-account-profile';
    const unProfileId = 'navbar-unaccount-profile';
    const sellerId = 'navbar-seller-profile';
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                className="NavBar"
                position="static"
                style={{ borderRadius: "1px" }}
            >
                <Toolbar>
                    <Box display='flex' flexGrow={1}>
                        <Link to="/" className="Navbar-RoutingLink">
                            <div className="BobbleLogoPadding">
                                <img className='Bobble Navbar-LogoLarge' src={navLogo} alt='Bobble' />
                                <img className='Bobble Navbar-LogoSmall' src={smallNavLogo} alt='Bobble' />
                            </div>
                        </Link>
                        <Link to="/" className="Navbar-RoutingLink"><Button color='inherit'><h4
                            className="navbar-links">Products</h4> <ShoppingBagOutlinedIcon/></Button></Link>
                        <Link to="/my-shopping-cart" className="Navbar-RoutingLink"><Button color='inherit'><h4
                            className="navbar-links">My Cart</h4><ShoppingCartOutlinedIcon /></Button></Link>
                    </Box>
                    {/*Not signed in*/}
                    {!cookies.user && (
                        <div>
                            <IconButton
                                sx={{ borderRadius: '10px !important' }}
                                size="small"
                                edge="end"
                                aria-label="account of non member"
                                aria-controls={unProfileId}
                                aria-haspopup="true"
                                onClick={handleOpenLogin}
                                color="inherit"
                            >
                                <p style={{ paddingInline: '0.5rem' }}>Login</p>
                            </IconButton>
                            <IconButton
                                sx={{ borderRadius: '10px !important' }}
                                size="small"
                                edge="end"
                                aria-label="account of non member"
                                aria-controls={unProfileId}
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <Link className="Navbar-RoutingLink" to='/register'><p
                                    style={{ paddingInline: '0.5rem' }}>Sign
                                    up</p></Link>
                            </IconButton>
                            <IconButton
                                sx={{ borderRadius: '10px !important', ':disabled': { color: 'white' } }}
                                size="small"
                                edge="end"
                                aria-label="account of non member"
                                aria-controls={unProfileId}
                                aria-haspopup="true"
                                disabled
                            >
                                <AccountCircle />
                            </IconButton>
                        </div>
                    )}
                    {/*Signed in as customer*/}
                    {cookies.user && cookies.user.user.role === 'CUSTOMER' && (
                        <div>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={profileId}
                                aria-haspopup="true"
                                onClick={handleOpenUserMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id='navbar-account-profile'
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseUserMenu}
                            >
                                {cookies.user.user.username && (<Typography style={{padding:"0.3rem 1rem"}}>Hi, {cookies.user.user.username}</Typography>)}
                                <Link className='RoutingLink' to='profile'>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        Profile
                                    </MenuItem>
                                </Link>
                                <Link className='RoutingLink' to='view-orders'>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        My Orders
                                    </MenuItem>
                                </Link>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                    {/*Signed in as seller*/}
                    {cookies.user && cookies.user.user.role === 'SELLER' && (
                        <div>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={sellerId}
                                aria-haspopup="true"
                                onClick={handleOpenUserMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id='navbar-seller-profile'
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseUserMenu}
                            >
                                {cookies.user.user.username && (<Typography style={{padding:"0.3rem 1rem"}}>Hi, {cookies.user.user.username}</Typography>)}
                                <Link className='RoutingLink' to='profile'>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        Profile
                                    </MenuItem>
                                </Link>
                                <Link className='RoutingLink' to='view-orders'>
                                    <MenuItem className='RoutingLink' onClick={handleCloseUserMenu}>
                                        Manage Orders
                                    </MenuItem>
                                </Link>
                                <Link className='RoutingLink' to="/seller">
                                    <MenuItem className='RoutingLink' onClick={handleCloseUserMenu}>
                                        Manage Products
                                    </MenuItem>
                                </Link>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                    {/*Signed in as admin*/}
                    {cookies.user && cookies.user.user.role === 'ADMIN' && (
                        <div>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={sellerId}
                                aria-haspopup="true"
                                onClick={handleOpenUserMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id='navbar-seller-profile'
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseUserMenu}
                            >
                                {cookies.user.user.username && (<Typography style={{padding:"0.3rem 1rem"}}>Hi, {cookies.user.user.username}</Typography>)}
                                <Link className='RoutingLink' to='profile'>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        Profile
                                    </MenuItem>
                                </Link>
                                <Link className='RoutingLink' to='/admin'>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        Admin Page
                                    </MenuItem>
                                </Link>
                                <Link className='RoutingLink' to='admin/seller'>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                       Manage Products
                                    </MenuItem>
                                </Link>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            {/*Login form state set to open*/}
            {openLogin &&
                <div>
                    <Dialog open={openLogin} onClose={handleCloseLogin}>
                        <DialogTitle style={{ paddingBottom: 0 }}>Login</DialogTitle>
                        <form onSubmit={handleLoginSubmit} >
                            <DialogContent>

                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Email Address"
                                    value={user.email}
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    required
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="password"
                                    label="Password"
                                    value={user.password}
                                    type="password"
                                    fullWidth
                                    variant="standard"
                                    required
                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                />

                                <DialogContentText style={{ paddingTop: '1rem' }}>
                                    Don't already have an account? <Link className="GreenLink" to='/register'
                                        onClick={handleCloseLogin}>Sign up</Link> here.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button className='GreenButtonText' onClick={handleCloseLogin}>Cancel</Button>
                                <Button className='GreenButtonOutlined' variant='outlined' type='submit'>Login</Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                </div>}
        </Box>
    );
}
