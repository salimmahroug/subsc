import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Typography,
  Grid,
  Paper,
  Box,
  Container,
  Divider,
  CircularProgress,
} from "@mui/material";
import PaymentHistory from "../components/Payment/PaymentHistory";
import Pagination from "@mui/material/Pagination";
import dayjs from "dayjs";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/payment/${id}`,
          {
            params: {
              page: currentPage,
              limit: pageSize,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPayments(response.data.payments);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, [id, currentPage, pageSize]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        style={{ textAlign: "center", marginTop: "150px" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Box p={1}>
        {user && (
          <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
            <Typography variant="h4" gutterBottom mb={4}>
              {`${user.prenom} ${user.nom}`}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1" align="left">
                  <strong>Date:</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" align="right">
                  {dayjs(user.dateOfBirth).format("DD/MM/YYYY")}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" align="left">
                  <strong>servers:</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" align="right">
                  {user.nombre_de_servers}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" align="left">
                  <strong>Téléphone:</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" align="right">
                  {user.telephone}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" align="left">
                  <strong>Montant:</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" align="right">
                  {user.montant} DT
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Historique des paiements
          </Typography>
          <Divider />
          {payments.map((payment) => (
            <PaymentHistory key={payment._id} payment={payment} />
          ))}
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default UserDetails;
