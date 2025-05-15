// start on 5 march 2025 by medha

import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  Typography,
  Box,
  Grid,
  Select,
  MenuItem,
  InputLabel,
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

function SectionPage() {
  const [formData, setFormData] = useState({
    sectionName: "",

    test: "",
  });

  const [formErrors, setFormErrors] = useState({
    sectionName: "",

    test: "",
  });

  const [disableButton, setDisableButton] = useState(true);
  const [allTest, setAllTest] = useState([]);

  // call api to show list of test for dropdown
  useEffect(() => {
    axios
      .get(api + "/newskill/all-test")
      .then(async (response) => {
        setAllTest(response.data);
      })
      .catch((error) => {});
  }, []);

  // on chnage funstion for text field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // form validation
  const validateForm = () => {
    let errors = {};
    if (!formData.sectionName) errors.sectionName = "Section Name is required";

    if (!formData.test) errors.test = "Test Name is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // on submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios
          .post(api + `/newskill/add/${formData.test}`, {
            sectionName: formData.sectionName,
          })
          .then(async (response) => {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Section Add Successfully.",
              showConfirmButton: true,
            }).then(async () => {
              window.location.reload();
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to add section name. Please try again later.",
              showConfirmButton: true,
            });
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // submit button disbale or enable
  useEffect(() => {
    if (formData.sectionName == "" || formData.test == "") {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [formData]); // Only re-run effect if searchTerm changes

  return (
    <Box p={3}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Section
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <FormControl fullWidth>
                  <InputLabel>Select Test Name</InputLabel>
                  <Select
                    label="Select Test Name"
                    name="test"
                    value={formData.test}
                    onChange={handleChange}
                    error={Boolean(formErrors.test)}
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
                    {allTest.map((val, ind) => {
                      return (
                        <MenuItem value={val.id} key={ind}>
                          {val.testName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <TextField
                  label="Section Name"
                  name="sectionName"
                  value={formData.sectionName}
                  onChange={handleChange}
                  error={Boolean(formErrors.sectionName)}
                  helperText={formErrors.sectionName}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3} lg={1.5}>
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
              </Grid>
            </Grid>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default SectionPage;
