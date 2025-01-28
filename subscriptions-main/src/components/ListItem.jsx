import React, { useState } from "react";
import {
  Grid,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditDrawer from "./EditDrawer ";

const ListItem = ({ order, selectedItem, handleSelectChange, onDelete }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleEditClick = () => {
    setIsDrawerOpen(true);
  };

  const handleViewClick = () => {
    navigate(`/view/${order._id}`);
  };

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete(order._id);
    setIsDialogOpen(false);
  };

  // Calculate the difference between today and the date of birth
  const calculateTimeUntilDOB = (dob) => {
    const currentDate = new Date();
    const dobDate = new Date(dob);

    let years = dobDate.getFullYear() - currentDate.getFullYear();
    let months = dobDate.getMonth() - currentDate.getMonth();
    let days = dobDate.getDate() - currentDate.getDate();

    // Adjust for negative months or days
    if (days < 0) {
      months--;
      days += new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      ).getDate(); // Days in previous month
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  };

  const { years, months, days } = calculateTimeUntilDOB(order.dateOfBirth);

  const timeUntilDOB = `${
    years > 0 ? `${years} an${years > 1 ? "s" : ""}, ` : ""
  }${months > 0 ? `${months} mois${months > 1 ? "s" : ""}, ` : ""}${
    days > 0 ? `${days} jour${days > 1 ? "s" : ""}` : ""
  }`;

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1; // Months are zero-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isDOBInTheFuture = new Date(order.dateOfBirth) > new Date();

  return (
    <div>
      <Grid
        container
        spacing={1}
        alignItems="center"
        style={{ marginTop: "10px" }}
      >
        <Grid item xs={12} sm={8} md={9}>
          <div
            style={{
              display: "flex",
              border: "1px solid gray",
              borderRadius: "5px",
              padding: "8px",
              width: "100%",
              height: "40px",
              alignItems: "center",
              boxSizing: "border-box",
              fontSize: "17px",
              color: "gray",
              justifyContent: "space-between",
              backgroundColor: isDOBInTheFuture
                ? "rgba(98, 241, 113, 0.15)"
                : "transparent",
            }}
          >
            <Typography style={{ width: "60px" }}>
              {order.prenom}_{order.nom}
            </Typography>

            <Typography style={{ width: "210px" }}>
              <span style={{ color: isDOBInTheFuture ? "#44c752" : "red" ,fontSize: "14px" , marginRight:"10px" , position :"relative" ,width:"100px"  }}>
                {isDOBInTheFuture
                  ? timeUntilDOB
                    ? `${timeUntilDOB}`
                    : ""
                  : "passée"}
              </span>{" "}
              <strong >
                {formatDate(order.dateOfBirth)}
              </strong>
            </Typography>

            <Typography style={{ width: "140px" }}>
              {order.telephone}
            </Typography>
            <Typography style={{ width: "60px" }}>
              {order.nombre_de_servers}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Paper elevation={6} style={{ display: "flex", borderRadius: "5px" }}>
            <Button
              onClick={handleDeleteClick}
              variant="outlined"
              size="small"
              fullWidth
              style={{
                width: "50px",
                height: "38px",
                border: "0.5px solid red",
                borderRadius: "5px ",
                marginRight: "5px",
              }}
            >
              <DeleteIcon style={{ fontSize: 16, color: "red", margin: 0 }} />
            </Button>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              style={{
                height: "38px",
                border: "0.5px solid black",
                borderRadius: "5px 0 0 5px",
                color: "black",
                boxShadow: "none",
                fontSize: "12px",
                padding: "4px",
              }}
              onClick={handleEditClick}
              startIcon={<EditIcon style={{ fontSize: 16, color: "black" }} />}
            >
              Edit
            </Button>
            <Button
              onClick={handleViewClick}
              variant="outlined"
              size="small"
              fullWidth
              style={{
                height: "38px",
                border: "0.5px solid black",
                borderRadius: "0 5px 5px 0",
                color: "black",
                boxShadow: "none",
                fontSize: "12px",
                padding: "4px",
              }}
              startIcon={
                <VisibilityIcon style={{ fontSize: 16, color: "black" }} />
              }
            >
              View
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <EditDrawer
        selectedItem={selectedItem}
        handleSelectChange={handleSelectChange}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        order={order}
      />
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cet utilisateur ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListItem;
