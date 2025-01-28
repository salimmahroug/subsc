import React, { useState } from "react";
import {
  Grid,
  Box,
  Pagination,
  Stack,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ListItem from "../components/ListItem";
import SearchBar from "../components/SearchBar";
import CreateNewButton from "../components/CreateNewButton";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { colors } from "../constant/color";
import { useNavigate } from "react-router-dom";

const UsersList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const PerPage = 8;

  // Fetch users data
  const {
    data: usersData = { users: [], total: 0 },
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", currentPage, searchQuery, selectedOption],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/user`,
        {
          params: {
            page: currentPage,
            perPage: PerPage,
            search: searchQuery,
            category: selectedOption === "none" ? "" : selectedOption, // Handle "none" case
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
  });

  // Fetch categories data
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/categories`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      return response.data;
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchText);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDelete = (id) => {
    deleteUserMutation.mutate(id);
  };

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
    setCurrentPage(1);
  };

  const { users, total } = usersData;

  if (isError) {
    navigate("/login");
    return null;
  }

  return (
    <Box sx={{ px: 2, pt: 6, "@media (min-width: 600px)": { px: 12 } }}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <SearchBar
                searchText={searchText}
                handleSearchTextChange={handleSearchTextChange}
                handleSearchSubmit={handleSearchSubmit}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="dropdown-label">Category</InputLabel>
                <Select
                  labelId="dropdown-label"
                  value={selectedOption}
                  onChange={handleDropdownChange}
                  label="Category"
                >
                  <MenuItem value="">
                    <em>Tous</em>
                  </MenuItem>
                  {categories.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <CreateNewButton />
        </Grid>
      </Grid>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 16 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid
            container
            spacing={1}
            alignItems="center"
            style={{ marginTop: "10px" }}
          >
            <Grid item xs={12}>
              {users.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    borderBottom: "1px solid gray",
                    padding: "8px",
                    maxWidth: "74.5%",
                    height: "40px",
                    alignItems: "center",
                    boxSizing: "border-box",
                    fontSize: "17px",
                    color: colors.primary,
                    justifyContent: "space-between",
                  }}
                >
                  <Typography style={{ width: "60px" }}>
                    <strong>Prenom</strong>
                  </Typography>
                  <Typography style={{ width: "60px" }}>
                    <strong>Date</strong>
                  </Typography>
                  <Typography style={{ width: "60px" }}>
                    <strong>Téléphone</strong>
                  </Typography>
                  <Typography style={{ width: "60px" }}>
                    <strong>servers</strong>
                  </Typography>
                </div>
              )}
            </Grid>
          </Grid>
          {users.map((user) => (
            <ListItem key={user._id} order={user} onDelete={handleDelete} />
          ))}
          {users.length === 0 && (
            <Alert variant="outlined" severity="info">
              Aucun utilisateur trouvé !!
            </Alert>
          )}
          {users.length > 0 && (
            <Stack spacing={2} alignItems="center" my={2}>
              <Pagination
                count={Math.ceil(total / PerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default UsersList;
