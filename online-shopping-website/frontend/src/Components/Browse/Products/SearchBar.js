import propTypes from 'prop-types';
import React from 'react';
import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';

export const SearchBar = (props) => {
    let filters = props.filters;
    const filterData = props.filterData;

    const [searchValue, setSearchValue] = React.useState('');

    const handleSearchChange = (newValue) => {
        setSearchValue(newValue);
        filters.searchQuery = newValue;
        filterData();
    }

    return (
        <div className="SearchBar">
            <TextField
                sx={props.style}
                value={searchValue}
                label={props.label}
                variant="outlined"
                type="search"
                onChange={(e) => handleSearchChange(e.target.value)}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: searchValue && (
                        <IconButton
                            aria-label="Clear search"
                            onClick={() => handleSearchChange('')}  
                        >
                            <CancelIcon />
                        </IconButton>
                    )
                }}
            />
        </div>
    );
}

// Checking filter and filterData types
SearchBar.propTypes = {
    filters: propTypes.shape({
        searchQuery: propTypes.string
    }),
    filterData: propTypes.func
}