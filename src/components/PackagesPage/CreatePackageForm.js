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
import { getPackageDataApi } from "./PackageList";
import { api } from "../../Api";

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
function PackagesPage() {
  const [formData, setFormData] = useState({
    package_name: "",
    creation_date: "",
    expiration_date: "",
    amount: "",
    validity: "",
    no_of_internships: "",
    package_type: "",
    package_for: "",
    no_of_dept: "",
    package_desc: "",
  });

  const [formErrors, setFormErrors] = useState({
    package_name: "",
    creation_date: "",
    expiration_date: "",
    amount: "",
    validity: "",
    no_of_internships: "",
    package_type: "",
    package_for: "",
    no_of_dept: "",
    package_desc: "",
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
    if (!formData.package_name) errors.package_name = "package_name is required";
    if (!formData.creation_date) errors.creation_date = "creation_date is required";
    if (!formData.expiration_date) errors.expiration_date = "expiration_date is required";
    if (!formData.amount) errors.amount = "amount is required";
    if (!formData.validity) errors.validity = "validity is required";
    if (!formData.no_of_internships) errors.no_of_internships = "no_of_internships is required";
    if (!formData.package_type) errors.package_type = "package_type is required";
    if (!formData.package_for) errors.package_for = "package_for is required";
    if (!formData.no_of_dept) errors.no_of_dept = "no_of_dept is required";
    if (!formData.package_desc) errors.package_desc = "package_desc is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (
      formData.package_name == "" ||
      formData.creation_date == "" ||
      formData.expiration_date == "" ||
      formData.amount == "" ||
      formData.validity == "" ||
      formData.no_of_internships == "" ||
      formData.package_type == "" ||
      formData.package_for == "" ||
      formData.no_of_dept == ""
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [formData]);

  const handleSubmit = async (e) => {
    const data = await getPackageDataApi();
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(api + "/newskill/create", formData);
        console.log("Form submitted successfully", response.data);

        // Handle successful form submission, e.g., show a success message or redirect
      } catch (error) {
        console.error("There was an error submitting the form", error);
        // Handle error, e.g., show an error message
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Package
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
                label="Package Name"
                name="package_name"
                value={formData.package_name}
                onChange={handleChange}
                error={Boolean(formErrors.package_name)}
                helperText={formErrors.package_name}
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
                label="Validity"
                name="validity"
                type="number"
                value={formData.validity}
                onChange={handleChange}
                error={Boolean(formErrors.validity)}
                helperText={formErrors.validity}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="No.of Internships"
                name="no_of_internships"
                type="number"
                value={formData.no_of_internships}
                onChange={handleChange}
                error={Boolean(formErrors.no_of_internships)}
                helperText={formErrors.no_of_internships}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="No.of Department"
                name="no_of_dept"
                type="number"
                value={formData.no_of_dept}
                onChange={handleChange}
                error={Boolean(formErrors.no_of_dept)}
                helperText={formErrors.no_of_dept}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="Start Date"
                name="creation_date"
                type="date"
                value={formData.creation_date}
                onChange={handleChange}
                error={Boolean(formErrors.creation_date)}
                helperText={formErrors.creation_date}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="End Date"
                name="expiration_date"
                type="date"
                value={formData.expiration_date}
                onChange={handleChange}
                error={Boolean(formErrors.expiration_date)}
                helperText={formErrors.expiration_date}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="Package Description"
                name="package_desc"
                type="text"
                value={formData.package_desc}
                onChange={handleChange}
                error={Boolean(formErrors.package_desc)}
                helperText={formErrors.package_desc}
                fullWidth
              />
            </FormControl>

            <FormControl sx={{ minWidth: 200 }} error={Boolean(formErrors.role)}>
              <InputLabel id="role-label">Package Type</InputLabel>
              <Select
                labelId="Package Type"
                id="package_type"
                name="package_type"
                value={formData.package_type}
                onChange={handleChange}
                label="Package Type"
                sx={{ color: "blue", height: "44px" }}
              >
                <MenuItem value="">
                  <em>--Select Package Type--</em>
                </MenuItem>

                <MenuItem value="recharge">Recharge</MenuItem>
                <MenuItem value="topup">Topup</MenuItem>
              </Select>
              {formErrors.package_type && (
                <Typography variant="caption" color="error">
                  {formErrors.package_type}
                </Typography>
              )}
            </FormControl>

            <FormControl sx={{ minWidth: 200 }} error={Boolean(formErrors.role)}>
              <InputLabel id="package_for">Package For:</InputLabel>
              <Select
                labelId="Package For"
                id="package_for"
                name="package_for"
                value={formData.package_for}
                onChange={handleChange}
                label="Package For"
                sx={{ color: "blue", height: "44px" }}
              >
                <MenuItem value="">
                  <em>--Select Package Type--</em>
                </MenuItem>

                <MenuItem value="COL">College</MenuItem>
                <MenuItem value="COM">Company</MenuItem>
              </Select>
              {formErrors.package_for && (
                <Typography variant="caption" color="error">
                  {formErrors.package_for}
                </Typography>
              )}
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

export default PackagesPage;
