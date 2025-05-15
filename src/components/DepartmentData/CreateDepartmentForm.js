// src/components/CompanyForm.js

import React, { useEffect, useState } from "react";
import { api } from "../../Api";
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
import { getDepartmentDataApi } from "./DepartmentList";
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
function DepartmentPage() {
  const [formData, setFormData] = useState({
    dept_name: "",
    dept_type: "",
  });

  const [formErrors, setFormErrors] = useState({
    dept_name: "",
    dept_type: "",
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
    if (!formData.dept_name) errors.dept_name = "dept_name is required";
    if (!formData.dept_type) errors.dept_type = "dept_type is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await getDepartmentDataApi();

    if (validateForm()) {
      try {
        const response = await axios.post(api + "/newskill/createDept", formData);
        console.log("Form submitted successfully", response.data);
        location.reload();
        // Handle successful form submission, e.g., show a success message or redirect
      } catch (error) {
        console.error("There was an error submitting the form", error);
        // Handle error, e.g., show an error message
      }
    }
  };
  useEffect(() => {
    if (formData.dept_name == "" || formData.dept_type == "") {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [formData]); // Only re-run effect if searchTerm changes
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Department
        </Typography>
        <hr />
        <br />
        <form onSubmit={handleSubmit} noValidate style={{ paddingBottom: "10px" }}>
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
                label="Department Name"
                name="dept_name"
                value={formData.dept_name}
                onChange={handleChange}
                error={Boolean(formErrors.dept_name)}
                helperText={formErrors.dept_name}
                fullWidth
              />
            </FormControl>

            <FormControl sx={{ minWidth: 200 }} error={Boolean(formErrors.role)}>
              <InputLabel id="role-label">Department Type</InputLabel>
              <Select
                label="Department Type"
                id="dept_type"
                name="dept_type"
                value={formData.dept_type}
                onChange={handleChange}
                sx={{ color: "blue", height: "44px" }}
              >
                <MenuItem value="">
                  <em>--Select Department Type--</em>
                </MenuItem>

                <MenuItem value="UG">Under Graduate</MenuItem>
                <MenuItem value="PG">Post Graduate</MenuItem>
                <MenuItem value="diploma">Diploma</MenuItem>
                <MenuItem value="phd">PHD</MenuItem>
              </Select>
              {formErrors.package_type && (
                <Typography variant="caption" color="error">
                  {formErrors.dept_type}
                </Typography>
              )}
            </FormControl>

            <Button
              type="submit"
              style={disableButton ? style.disablebutton : style.enableButton}
              variant="contained"
              disabled={disableButton}
              color="error"
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

export default DepartmentPage;
