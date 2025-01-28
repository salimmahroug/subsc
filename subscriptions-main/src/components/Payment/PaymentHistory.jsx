import React, { useState } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  IconButton,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useQuery } from "@tanstack/react-query";

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const fetchCategory = async (categoryId) => {
  const token = getAuthToken();
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/categories/${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const PaymentHistory = ({ payment, onDelete }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    data: category,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["category", payment.category],
    queryFn: () => fetchCategory(payment.category),
    enabled: !!payment.category,
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    onDelete(payment._id);
    handleClose();
  };

  if (error) {
    console.error("Failed to fetch category:", error);
  }

  return (
    <Paper
      key={payment._id}
      elevation={3}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px",
        marginTop: "25px",
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} sm={3} md={2}>
          <Typography>
            {new Date(payment.paymentDate).toLocaleDateString()}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Typography>{payment.montant}DT</Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={5}>
          <Typography>
            {isLoading
              ? "Loading..."
              : category
              ? category.label
              : "Category not found"}
          </Typography>
        </Grid>

        {onDelete && (
          <Grid
            item
            xs={12}
            sm={1}
            md={2}
            style={{ textAlign: isSmallScreen ? "right" : "center" }}
          >
            <IconButton size="small" color="error" onClick={handleClickOpen}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmer la suppression"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer ce paiement ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PaymentHistory;
