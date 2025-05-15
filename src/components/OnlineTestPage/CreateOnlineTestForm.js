// src/components/CompanyForm.js

import React, { useEffect, useState } from "react";
import { Container, TextField, Button, FormControl, Typography, Box } from "@mui/material";
import axios from "axios";
import { getOnlineTestDataApi } from "./OnlineTestList";
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

function OnlineTestPage() {
  const [formData, setFormData] = useState({
    testName: "",
    total_mark: "",
    total_que: "",
    time: "",
    cut_off: "",
    mark_per_que: "",
  });

  const [formErrors, setFormErrors] = useState({
    testName: "",
    total_mark: "",
    total_que: "",
    time: "",
    cut_off: "",
    mark_per_que: "",
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
    if (!formData.testName) errors.testName = "testName is required";
    if (!formData.total_mark) errors.total_mark = "total_mark is required";
    if (!formData.total_que) errors.total_que = "total_que is required";
    if (!formData.time) errors.time = "time is required";
    if (!formData.cut_off) errors.cut_off = "cut_off is required";
    if (!formData.mark_per_que) errors.mark_per_que = "mark_per_que is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    // const data = await getOnlineTestDataApi();
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(api + "/newskill/createTest", formData);
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
    if (
      formData.testName == "" ||
      formData.total_mark == "" ||
      formData.total_que == "" ||
      formData.time == "" ||
      formData.cut_off == "" ||
      formData.mark_per_que == ""
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [formData]); // Only re-run effect if searchTerm changes
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Online Test{" "}
        </Typography>

        <hr />
        <br />
        <form onSubmit={handleSubmit} noValidate style={{ paddingBottom: "15px" }}>
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
                label="Test Name"
                name="testName"
                value={formData.testName}
                onChange={handleChange}
                error={Boolean(formErrors.testName)}
                helperText={formErrors.testName}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="Total Mark"
                name="total_mark"
                type="number"
                value={formData.total_mark}
                onChange={handleChange}
                error={Boolean(formErrors.total_mark)}
                helperText={formErrors.total_mark}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="Total Que"
                name="total_que"
                type="number"
                value={formData.total_que}
                onChange={handleChange}
                error={Boolean(formErrors.total_que)}
                helperText={formErrors.total_que}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="Time"
                name="time"
                type="number"
                value={formData.time}
                onChange={handleChange}
                error={Boolean(formErrors.time)}
                helperText={formErrors.time}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="Cutt Off"
                name="cut_off"
                type="number"
                value={formData.cut_off}
                onChange={handleChange}
                error={Boolean(formErrors.cut_off)}
                helperText={formErrors.cut_off}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="Marks/Que"
                name="mark_per_que"
                type="number"
                value={formData.mark_per_que}
                onChange={handleChange}
                error={Boolean(formErrors.mark_per_que)}
                helperText={formErrors.mark_per_que}
                fullWidth
              />
            </FormControl>

            <Button
              type="submit"
              style={disableButton ? style.disablebutton : style.enableButton}
              variant="contained"
              disabled={disableButton}
              color="success"
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

export default OnlineTestPage;
