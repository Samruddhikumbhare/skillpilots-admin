// start on 17 march 2025 by medha

import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import axios from "axios";
import { api } from "../../Api";
import { Modal, Box, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Swal from "sweetalert2";

const EditTestName = ({ editData, handleClose, getTestDataApi, isEditModalOpen }) => {
  const [formData, setFormData] = useState({
    id: "",
    testName: "",
    description: "",
    timeLimit: "",
    marksPerQuestion: "",
    noOfQuestion: "",
    passingMarks: "",
  });
  const [allTechnologies, setAllTechnologies] = useState([]);
  const [tName, setTName] = useState("");

  // get all technologies
  useEffect(() => {
    axios
      .get(api + "/newskill/getTech")
      .then((response) => {
        setAllTechnologies(response.data.technologies);
        const isExisting = response.data.technologies.some(
          (tech) => tech.technology_name === editData.testName
        );
        setTName(isExisting ? editData.testName : "other");
      })
      .catch(() => {});
  }, []);

  // set data that has to edit
  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id || "",
        testName: editData.testName || "",
        description: editData.description || "",
        timeLimit: editData.timeLimit || "",
        marksPerQuestion: editData.marksPerQuestion || "",
        noOfQuestion: editData.noOfQuestions || "",
        passingMarks: editData.passingMarks || "",
      });

      const isExisting = allTechnologies.some((tech) => tech.technology_name === editData.testName);
      setTName(isExisting ? editData.testName : "other");
    }
  }, [editData]);

  // on chnage event
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

  // on submit event
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      testName: formData.testName,
      description: formData.description,
      timeLimit: formData.timeLimit,
      marksPerQuestion: formData.marksPerQuestion,
      noOfQuestion: formData.noOfQuestion,
      passingMarks: formData.passingMarks,
    };

    await axios
      .put(api + `/newskill/updateTest/${formData.id}`, payload)
      .then(async (response) => {
        handleClose();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Test Update Successfully.",
          showConfirmButton: true,
        }).then(async () => {
          getTestDataApi();
          window.location.reload();
        });
      })
      .catch((error) => {
        handleClose();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to edit Test. Please try again later.",
          showConfirmButton: true,
        });
      });
  };

  return (
    <Modal open={isEditModalOpen}>
      <Box
        sx={{
          width: { xs: "95%", sm: "95%", md: "85%", lg: "60%" },
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#dfe3eb",
          padding: "20px",
          borderRadius: "8px",
          background: "white",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          zIndex: "1000000",
          "& .MuiTextField-root": {
            margin: "8px",
            width: "100%", // Make the text fields take full width
          },
          "& .MuiButton-root": {
            margin: "8px",
          },
          "& .MuiSelect-root": {
            margin: "8px",
            width: "100%", // Make the select fields take full width
          },
          "& .MuiTextareaAutosize-root": {
            margin: "8px",
            width: "100%", // Make the textarea take full width
          },
        }}
      >
        <div>
          <h3>Edit Test</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            <Grid container spacing={2}>
              <Grid p={1} xs={12} md={tName === "other" ? 6 : 12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ ml: 1.4, mt: 1 }}>Select Test Name *</InputLabel>
                  <Select
                    label="Select Test Name *"
                    name="tName"
                    value={tName}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ padding: "12px  12px 12px 4px !important", margin: "10px" }}
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
                <Grid p={1} xs={12} md={tName === "other" ? 6 : 12}>
                  <TextField
                    sx={{ mb: 2 }}
                    name="testName"
                    value={formData.testName}
                    onChange={handleChange}
                    label="Other Test Name"
                    variant="outlined"
                    required
                    fullWidth
                  />
                </Grid>
              )}

              <Grid p={1} xs={12} sm={6} md={3} lg={3}>
                <TextField
                  sx={{ mb: 2 }}
                  name="timeLimit"
                  value={formData.timeLimit}
                  onChange={handleChange}
                  label="Time Limit (in min)"
                  variant="outlined"
                  required
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid p={1} xs={12} sm={6} md={3} lg={3}>
                <TextField
                  sx={{ mb: 2 }}
                  name="marksPerQuestion"
                  value={formData.marksPerQuestion}
                  onChange={handleChange}
                  label="Marks Per Question"
                  variant="outlined"
                  required
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid p={1} xs={12} sm={6} md={3} lg={3}>
                <TextField
                  sx={{ mb: 2 }}
                  name="noOfQuestion"
                  value={formData.noOfQuestion}
                  onChange={handleChange}
                  label="Total Questions"
                  variant="outlined"
                  required
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid p={1} xs={12} sm={6} md={3} lg={3}>
                <TextField
                  sx={{ mb: 2 }}
                  name="passingMarks"
                  value={formData.passingMarks}
                  onChange={handleChange}
                  label="Passing Marks"
                  variant="outlined"
                  required
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid p={1} xs={12}>
                <TextField
                  sx={{ mb: 2 }}
                  name="description"
                  fullWidth
                  value={formData.description}
                  onChange={handleChange}
                  label="Description"
                  variant="outlined"
                  required
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained" sx={{ color: "white !important" }}>
                Save
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={handleClose}
                sx={{ color: "white !important" }}
              >
                Close
              </Button>
            </Box>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

EditTestName.propTypes = {
  editData: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  getTestDataApi: PropTypes.func.isRequired,
  isEditModalOpen: PropTypes.boolean,
};

export default EditTestName;
