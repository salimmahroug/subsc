import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import { colors } from "../constant/color";
import {
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const NavBar = () => {
  const [admission, setAdmission] = useState(null);
  const [rentable, setRentable] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [inputSalim, setInputSalim] = useState("");
  const [inputMontasar, setInputMontasar] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const fetchAdmission = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admission`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdmission(response.data);
    } catch (error) {
      console.error("Error fetching admission:", error);
    }
  };

  const fetchRentable = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/rentable`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRentable(response.data);
    } catch (error) {
      console.error("Error fetching rentable:", error);
    }
  };

  const updateRentable = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/rentable/update`,
        { salim: Number(inputSalim), montasar: Number(inputMontasar) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRentable(response.data.rentable);
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating rentable:", error);
    }
  };

  useEffect(() => {
    fetchAdmission();
    fetchRentable();
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: colors.primary,
        px: isMobile ? 1 : 2,
      }}
    >
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Box
                sx={{
                  width: 250,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <List>
                  <ListItem button component={Link} to="/users">
                    <ListItemText primary="Users" />
                  </ListItem>
                  <ListItem button component={Link} to="/dashboard">
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                  <ListItem button component={Link} to="/settings">
                    <ListItemText primary="Settings" />
                  </ListItem>
                </List>
                <Divider />
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body2">
                    &copy; 2025 Zarsis Waiter Management
                  </Typography>
                </Box>
              </Box>
            </Drawer>
          </>
        ) : (
          <Link style={{ textDecoration: "none", color: "white" }} to="/users">
            <img src="/logo_black.jpeg" alt="Logo" style={{ height: "70px" }} />
          </Link>
        )}

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, textAlign: isMobile ? "left" : "center" }}
        >
          <Link style={{ textDecoration: "none", color: "white" }} to="/users">
            Zarsis Waiter Management
          </Link>
        </Typography>

        {!isMobile && admission && (
          <Typography
            variant="body1"
            sx={{
              color: "white",
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            Admission : {admission.value} DT
          </Typography>
        )}

        {!isMobile && rentable && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenModal(true)}
            sx={{ marginLeft: 2 }}
          >
            Rentable : {rentable.value} DT
          </Button>
        )}

        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isMobile ? 300 : 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 4,
              boxShadow: 24,
            }}
          >
            <Typography variant="h6" mb={2}>
              Gestion de Rentable / Total :{" "}
              {rentable?.montasar + rentable?.salim} DT
            </Typography>
            <Typography variant="body1" mb={1}>
              Salim : {rentable?.salim} DT
            </Typography>
            <TextField
              label="Réduire Salim"
              variant="outlined"
              fullWidth
              value={inputSalim}
              onChange={(e) => setInputSalim(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="body1" mb={1}>
              Montasar : {rentable?.montasar} DT
            </Typography>
            <TextField
              label="Réduire Montasar"
              variant="outlined"
              fullWidth
              value={inputMontasar}
              onChange={(e) => setInputMontasar(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={updateRentable}
            >
              Enregistrer
            </Button>
          </Box>
        </Modal>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
