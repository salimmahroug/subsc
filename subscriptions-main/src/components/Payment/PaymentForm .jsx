import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
} from "@mui/material";
import { colors } from "../../constant/color";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const PaymentForm = ({ orderId, onPaymentAdded ,servers}) => {
  const [newPayment, setNewPayment] = useState({
    paymentDate: "",
    montant: "",
    category: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPayment({ ...newPayment, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSelectChange = (e) => {
    setNewPayment({ ...newPayment, category: e.target.value });
    setErrors({ ...errors, category: "" });
  };

  const validateForm = () => {
    const { paymentDate, montant, category } = newPayment;
    const newErrors = {};
    if (!paymentDate) newErrors.paymentDate = "Date de paiement est requise";
    if (!montant) newErrors.montant = "Montant est requis";
    if (!category) newErrors.category = "Catégorie est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPayment = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Convert the amount to a number
      const montantAsNumber = parseFloat(newPayment.montant);
      if (isNaN(montantAsNumber)) {
        throw new Error("Montant doit être un nombre valide");
      }

      // Ajouter le paiement via l'API
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/payment/${orderId}`,
        { ...newPayment, montant: montantAsNumber },  // Sending the montant as a number
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Added payment:", response.data);

      // Appel à l'API d'admission pour ajouter le montant à la valeur d'admission
      await updateAdmissionAmount(montantAsNumber);
      await updateRentableAmount(montantAsNumber);

      // Réinitialiser le formulaire après l'ajout
      setNewPayment({ paymentDate: "", montant: "", category: "" });
      onPaymentAdded(response.data);
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

  const updateAdmissionAmount = async (montant) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admission`,
        { value: montant },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Admission updated:", response.data);
    } catch (error) {
      console.error("Error updating admission:", error.response?.data || error.message);
    }
  };

  const updateRentableAmount = async (montant) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/rentable`,
        { value: montant-(70*servers) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Rentable updated:", response.data);
    } catch (error) {
      console.error("Error updating rentable:", error.response?.data || error.message);
    }
  };

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    },
  });

  return (
    <div>
      <Typography variant="subtitle2" gutterBottom>
        Ajouter un paiement
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <TextField
            fullWidth
            variant="outlined"
            label="Montant"
            type="number"
            value={newPayment.montant}
            name="montant"
            onChange={handleChange}
            error={!!errors.montant}
            helperText={errors.montant}
            style={{ marginBottom: "10px" }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            variant="outlined"
            label="Date de paiement"
            type="date"
            value={newPayment.paymentDate}
            name="paymentDate"
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.paymentDate}
            helperText={errors.paymentDate}
            style={{ marginBottom: "10px" }}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl
            fullWidth
            variant="outlined"
            style={{ marginBottom: "10px" }}
            error={!!errors.category}
          >
            <InputLabel htmlFor="category-select">Catégorie</InputLabel>
            <Select
              value={newPayment.category}
              onChange={handleSelectChange}
              label="Sélectionnez une catégorie"
              name="category"
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
            {errors.category && (
              <Typography variant="body2" color="error">
                {errors.category}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        fullWidth
        style={{ marginTop: "10px", backgroundColor: colors.primary }}
        onClick={handleAddPayment}
      >
        Ajouter un paiement
      </Button>
    </div>
  );
};

export default PaymentForm;
