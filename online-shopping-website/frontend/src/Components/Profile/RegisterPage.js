import * as React from 'react';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import provinces from 'provinces-ca';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

//key-value pairs for profile components
const profileProperties = {
    email: null,
    username: null,
    role: 'CUSTOMER',
    password: null,
    confPassword: null,
    firstName: null,
    lastName: null,
    street: null,
    city: null,
    province: null,
    postCode: null,
    sellerName: null
}

//signing up function
export const Register = () => {
    const [userCookie, setUserCookie] = useCookies(['user']);

    let navigator = useNavigate();

    //if seller, turn true. else, turn false
    const [seller, setSeller] = useState(false);

    //state for profile components
    const [values, setValues] = useState(profileProperties);

    //function executes when user selects seller or customer through radio buttons
    const handleChange = (event) => {
        if (event.target.name === 'CUSTOMER') {
            setSeller(false);
            setValues({ ...values, sellerName: null, role: 'CUSTOMER' });
        }
        else {
            setSeller(true);
            setValues({ ...values, role: 'SELLER' });
        }
    }

    //when user clicks submits form
    const processRegister = async(event) => {
        event.preventDefault();

        if (values.confPassword !== values.password) {
            window.alert('Passwords do not match.');
            return;
        }

        try {
            const registerResponse = await axios.post(
                process.env.REACT_APP_DB_CONNECTION + '/api/users/register', 
                {
                    ...values,
                    address1: `${values.street} ${values.city} ${values.province} ${values.postCode}`
                });
            setUserCookie('user', registerResponse.data);

            // Route to products page
            navigator('/');
        } catch (err) {
            // P2002 Error = One input is not unique
            if (err.response.data.error.code === 'P2002') {
                window.alert("An account already exists with the same " + err.response.data.error.meta.target[0] + ".");
            }
            else {
                window.alert(
                    err.response.data.error + ".\n" + 
                    (err.response.data.message ? err.response.data.message + "." : "")
                );
            }
        }
    }

    return (
        <div className='register-page'>
            {/* sign up form */}
            <form onSubmit={processRegister} className='sign-up'>
                <Stack spacing={2}>
                    <h1 className="TextGreen" style={{ marginTop: '0' }}>Sign Up</h1>
                    <TextField className='textfield-register' label="First name" variant="outlined" value={values.firstName} onChange={(e) => setValues({ ...values, firstName: e.target.value })} />
                    <TextField sx={{ paddingBottom: '1.5rem' }} label="Last name" variant="outlined" value={values.lastName} onChange={(e) => setValues({ ...values, lastName: e.target.value })} />
                    <TextField sx={{ paddingBottom: '1.5rem' }} label="Username" variant="outlined" value={values.username} onChange={(e) => setValues({ ...values, username: e.target.value })} />
                    <TextField sx={{ paddingBottom: '1.5rem' }} required inputProps={{ pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]+$", title: "username@domain" }} label="Email" variant="outlined" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
                    <TextField required type="password" inputProps={{ pattern: '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_=+|:;<>,.?/~(){}\\[\\]\\\\-]).{8,}$', title: 'Password must follow this format: - At least one digit - At least one lowercase character - At least one uppercase character - At least one special character - At least 8 characters' }} label="Password" variant="outlined" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} />
                    <TextField required type="password" label="Confirm password" variant="outlined" value={values.confPassword} onChange={(e) => setValues({ ...values, confPassword: e.target.value })} error={values.confPassword !== values.password} helperText={values.confPassword !== values.password ? "Passwords do not match" : ''} />
                    <FormLabel style={{ padding: '2rem 0 0.5rem 0' }}>Shipping address</FormLabel>
                    <TextField required inputProps={{ pattern: '^[0-9]+ .+$', title: 'Format: "StreetNumber StreetName"' }} label="Street" variant="outlined" value={values.street} onChange={(e) => setValues({ ...values, street: e.target.value })} />
                    <TextField required inputProps={{ pattern: '^[A-Za-z0-9 -]+$', title: 'Valid Characters: A-Z, a-z, 0-9 and hyphen' }} label="City" variant="outlined" value={values.city} onChange={(e) => setValues({ ...values, city: e.target.value })} />
                    <TextField required inputProps={{ pattern: '^[A-Z0-9 -]+$', title: 'Valid Characters: A-Z, 0-9, space, and hyphen' }} label="Postal Code" variant="outlined" value={values.postCode} onChange={(e) => setValues({ ...values, postCode: e.target.value })} />
                    <TextField
                        select
                        label="Province"
                        value={values.province}
                        onChange={(e) => setValues({ ...values, province: e.target.value })}
                        required>
                        {provinces.map((option) => (
                            <MenuItem key={option.abbreviation} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField required disabled label="Country" variant="outlined" value={'Canada'} />
                    <FormLabel style={{ paddingTop: '2rem' }}>Role</FormLabel>
                    {/* Radio buttons to handle customer/seller role selection */}
                    <RadioGroup
                        sx={{ paddingBottom: '2rem' }}
                        defaultValue="CUSTOMER"
                        name="controlled-radio-buttons-group"
                        // value={role}
                        onChange={handleChange}
                    >
                        <FormControlLabel
                            name="CUSTOMER"
                            value="CUSTOMER"
                            control={
                                <Radio
                                    sx={{
                                        '&.Mui-checked': {
                                            color: 'green',
                                        },
                                    }}
                                />
                            }
                            label="Customer"
                        />
                        <FormControlLabel
                            sx={{ paddingBottom: '1rem' }}
                            name="SELLER"
                            value="SELLER"
                            control={
                                <Radio
                                    sx={{
                                        '&.Mui-checked': {
                                            color: 'green',
                                        },
                                    }}
                                />
                            }
                            label="Seller"
                        />
                        {seller?<TextField required label="Seller name" variant="outlined" value={values.sellerName} onChange={(e) => setValues({ ...values, sellerName: e.target.value })}/> : null}
                    </RadioGroup>
                    <div style={{textAlign:'center'}}>
                        <Button type="submit" value="Sign Up" variant="contained" className='GreenButtonContained' sx={{ maxWidth: '10rem'}}>Sign Up</Button>
                    </div>
                </Stack>
            </form>
        </div>
    )
}