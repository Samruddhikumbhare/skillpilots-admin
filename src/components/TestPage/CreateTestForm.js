// start on 5 march 2025 by medha

import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
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

function TestPage() {
  const [formData, setFormData] = useState({
    testName: "",
    description: "",
    noOfQuestion: "",
    passingMarks: "",
    timeLimit: "",
    marksPerQuestion: "",
  });

  const [formErrors, setFormErrors] = useState({
    testName: "",
    description: "",
    noOfQuestion: "",
    passingMarks: "",
    timeLimit: "",
    marksPerQuestion: "",
  });
  const [allTechnologies, setAllTechnologies] = useState([]);
  const [disableButton, setDisableButton] = useState(true);
  const [tName, setTName] = useState("");

  // get all technologies
  useEffect(() => {
    axios
      .get(api + "/newskill/getTech")
      .then((response) => {
        setAllTechnologies(response.data.technologies);
      })
      .catch(() => {});
  }, []);

  // on chnage function of text field
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tName" && value !== "other") {
      setTName(value);
      setFormData({ ...formData, testName: value });
    } else if (name === "tName" && value === "other") {
      setTName("other"); // Keep "other" selected in dropdown
      setFormData({ ...formData, testName: "" }); // Reset the test name field
    } else {
      setFormData((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  // form validation
  const validateForm = () => {
    let errors = {};
    if (!formData.testName) errors.testName = "Test Name is required";
    if (!formData.description) errors.description = "Description is required";
    if (!formData.noOfQuestion) errors.noOfQuestion = "No. of Question is required";
    if (!formData.passingMarks) errors.passingMarks = "Passing Marks is required";
    if (!formData.timeLimit) errors.timeLimit = "Time Limit is required";
    if (!formData.marksPerQuestion) errors.marksPerQuestion = "Marks Per Question is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // on submit function and call api
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios
          .post(api + "/newskill/tests", formData)
          .then(async (response) => {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Test Name Add Successfully.",
              showConfirmButton: true,
            }).then(async () => {
              window.location.reload();
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to add test name. Please try again later.",
              showConfirmButton: true,
            });
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // disable enable btn
  useEffect(() => {
    if (
      formData.testName == "" ||
      formData.timeLimit == "" ||
      formData.marksPerQuestion == "" ||
      formData.noOfQuestion == "" ||
      formData.passingMarks == "" ||
      formData.description == ""
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [formData]); // Only re-run effect if searchTerm changes

  return (
    <Box p={3}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Test
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
            <Grid container spacing={2} ml={0}>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <FormControl fullWidth>
                  <InputLabel>Select Test Name</InputLabel>
                  <Select
                    label="Select Test Name"
                    name="tName"
                    value={tName}
                    onChange={handleChange}
                    error={Boolean(formErrors.tName)}
                    fullWidth
                    required
                    sx={{ padding: "12px  12px 12px 4px !important" }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300, // Set max height
                          overflowY: "auto", // Enable scrolling
                        },
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select Test Name
                    </MenuItem>
                    {allTechnologies.map((val, ind) => {
                      return (
                        <MenuItem value={val.technology_name} key={ind}>
                          {val.technology_name}
                        </MenuItem>
                      );
                    })}
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {tName === "other" && (
                <Grid item xs={12} sm={6} md={3} lg={3}>
                  <TextField
                    label="Other Test Name"
                    name="testName"
                    value={formData.testName}
                    onChange={handleChange}
                    error={Boolean(formErrors.testName)}
                    helperText={formErrors.testName}
                    fullWidth
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <TextField
                  label="Time Limit (in min)"
                  type="number"
                  name="timeLimit"
                  value={formData.timeLimit}
                  onChange={handleChange}
                  error={Boolean(formErrors.timeLimit)}
                  helperText={formErrors.timeLimit}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <TextField
                  label="Total Question"
                  type="number"
                  name="noOfQuestion"
                  value={formData.noOfQuestion}
                  onChange={handleChange}
                  error={Boolean(formErrors.noOfQuestion)}
                  helperText={formErrors.noOfQuestion}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <TextField
                  label="Marks Per Question"
                  type="number"
                  name="marksPerQuestion"
                  value={formData.marksPerQuestion}
                  onChange={handleChange}
                  error={Boolean(formErrors.marksPerQuestion)}
                  helperText={formErrors.marksPerQuestion}
                  fullWidth
                />
              </Grid>{" "}
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <TextField
                  label="Passing Marks"
                  type="number"
                  name="passingMarks"
                  value={formData.passingMarks}
                  onChange={handleChange}
                  error={Boolean(formErrors.passingMarks)}
                  helperText={formErrors.passingMarks}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={tName === "other" ? 6 : 9}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={Boolean(formErrors.description)}
                  helperText={formErrors.description}
                  fullWidth
                />
              </Grid>
            </Grid>

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
    </Box>
  );
}

export default TestPage;
