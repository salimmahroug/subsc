import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ searchText, handleSearchTextChange, handleSearchSubmit }) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <TextField
      label="Search"
      variant="outlined"
      value={searchText}
      onChange={handleSearchTextChange}
      onKeyPress={handleKeyPress}
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      fullWidth
    />
  );
};

export default SearchBar;
