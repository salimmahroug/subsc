import React, { useState, useEffect } from "react";
import {
  Drawer,
  Grid,
  Typography,
  IconButton,
  Pagination,
  Box,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import PaymentHistory from "./Payment/PaymentHistory";
import PaymentForm from "./Payment/PaymentForm ";

const EditDrawer = ({ isOpen, onClose, order }) => {
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/payment/${order._id}`,
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
  }, [order._id, currentPage, pageSize]);

  const handleDeletePayment = async (paymentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/payment/${order._id}/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedPayments = payments.filter(
        (payment) => payment._id !== paymentId
      );
      setPayments(updatedPayments);
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const handleAddPayment = (newPayment) => {
    setPayments((prevPayments) => [...prevPayments, newPayment]);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        style: { width: "80%", maxWidth: "600px" },
      }}
    >
      <div style={{ padding: "20px", paddingTop: "10px" }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography variant="h6"></Typography>
          <IconButton onClick={onClose}>
            <CloseIcon style={{ color: "black" }} />
          </IconButton>
        </Grid>
        <Typography variant="subtitle1" gutterBottom mb={3}>
          {order.prenom} {order.nom} ,{" "}
          {new Date(order.dateOfBirth).toLocaleDateString()}
        </Typography>

        <PaymentForm orderId={order._id} onPaymentAdded={handleAddPayment} servers={order.nombre_de_servers} />

        {loading && (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <CircularProgress />
          </div>
        )}
        {payments.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <Typography variant="subtitle1">
              Historique des paiements :
            </Typography>
            {payments.map((payment) => (
              <PaymentHistory
                key={payment._id}
                payment={payment}
                onDelete={handleDeletePayment}
              />
            ))}
            <Box mt={3} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default EditDrawer;
