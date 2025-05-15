// src/components/CompanyForm.js

import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  FormControl,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { getPlanDataApi } from "./PricingPlansList";
import { api } from "../../Api";
import Swal from "sweetalert2";

const style = {
  disablebutton: {
    backgroundColor: "#98cc98",
    color: "white",
  },
  enableButton: {
    backgroundColor: "green",
    color: "white",
  },
};
function PlanPage() {
  const [formData, setFormData] = useState({
    planName: "",
    amount: "",
    user: "",
  });

  const [formErrors, setFormErrors] = useState({
    planName: "",
    amount: "",
    user: "",
  });
  const [disableButton, setDisableButton] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const validateForm = () => {
    let errors = {};
    if (!formData.planName) errors.planName = "Plan Name is required";
    if (!formData.amount) errors.amount = "Amount is required";
    if (!formData.user) errors.user = "Total User is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (formData.planName == "" || formData.amount == "" || formData.user == "") {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await axios
          .post(api + "/newskill/createPlan", formData)
          .then(async (response) => {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Pricing Plans Update Successfully.",
              showConfirmButton: true,
            }).then(async () => {
              window.location.reload();
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to add pricing plan. Please try again later.",
              showConfirmButton: true,
            });
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Pricing Plan
        </Typography>
        <hr />
        <br />
        <form onSubmit={handleSubmit} noValidate style={{ padding: "10px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="Plan Name"
                name="planName"
                value={formData.planName}
                onChange={handleChange}
                error={Boolean(formErrors.planName)}
                helperText={formErrors.planName}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                error={Boolean(formErrors.amount)}
                helperText={formErrors.amount}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="Total User"
                name="user"
                type="number"
                value={formData.user}
                onChange={handleChange}
                error={Boolean(formErrors.user)}
                helperText={formErrors.user}
                fullWidth
              />
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              disabled={disableButton}
              color="error"
              style={disableButton ? style.disablebutton : style.enableButton}
              sx={{ minWidth: 100 }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default PlanPage;
