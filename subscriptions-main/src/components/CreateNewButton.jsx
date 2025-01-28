import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { colors } from "../constant/color";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const CreateNewButton = () => {
  const [open, setOpen] = useState(false);

  const initialFormData = {
    firstName: "",
    lastName: "",
    phone: "",
    dob: dayjs(),
    amount: "",
    category: "",
    nombre_de_servers: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const token = localStorage.getItem("token");

  const createUserMutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/user`,
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
  });


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    setFormData({
      ...formData,
      category: selectedCategoryId,
    });
  };

  const handleCreate = async () => {
    try {
      const newUser = {
        nom: formData.lastName,
        prenom: formData.firstName,
        telephone: formData.phone,
        nombre_de_servers: formData.nombre_de_servers,
        dateOfBirth: formData.dob,
        montant: formData.amount,
        category: formData.category,
      };

      // Créer l'utilisateur
      const userResponse = await createUserMutation.mutateAsync(newUser);

      // Créer le paiement
      

      console.log("User created:", userResponse);
      handleClose();
    } catch (error) {
      console.error("Error creating user or payment:", error);
    }
  };

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


  return (
    <div>
      <Button
        variant="contained"
        style={{ backgroundColor: colors.primary }}
        onClick={handleOpen}
      >
        Créer un nouvel
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
        <DialogContent dividers style={{ padding: 20 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                name="firstName"
                label="Prénom"
                type="text"
                fullWidth
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="lastName"
                label="Nom"
                type="text"
                fullWidth
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              {/* <TextField
                margin="dense"
                name="dob"
                label="Date de naissance"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.dob}
                onChange={handleInputChange}
              /> */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ width: "100%", marginTop: "8px" }}
                  label="Date"
                  value={formData.dob}
                  onChange={(newValue) => {
                    setFormData({
                      ...formData,
                      dob: newValue,
                    });
                  }}
                  format="DD-MM-YYYY"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="phone"
                label="Téléphone"
                type="tel"
                fullWidth
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="amount"
                label="Montant"
                type="number"
                fullWidth
                value={formData.amount}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel htmlFor="category-select">Catégorie</InputLabel>
                <Select
                  fullWidth
                  value={formData.category}
                  onChange={handleCategoryChange}
                  inputProps={{
                    name: "category",
                    id: "category-select",
                  }}
                >
                  {categories.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel htmlFor="nombre-de-servers-select">
                  Nombre de serveurs
                </InputLabel>
                <Select
                  fullWidth
                  value={formData.nombre_de_servers}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      nombre_de_servers: event.target.value,
                    })
                  }
                  inputProps={{
                    name: "nombre_de_servers",
                    id: "nombre-de-servers-select",
                  }}
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((number) => (
                    <MenuItem key={number} value={number}>
                      {number}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreate} color="primary">
            Créer
          </Button>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateNewButton;
