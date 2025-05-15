// start on 17 march 2025 by medha

import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid"; // Import Grid component from Material-UI
import axios from "axios";
import PropTypes from "prop-types";
import { api } from "../../Api";
import { Box, Checkbox, FormControl, InputLabel, ListItemText, Modal } from "@mui/material";
import Swal from "sweetalert2";

const EditQueTest = ({
  handleClose,
  getTestDataApi,
  isEditModalOpen,
  editData,
  setSelectedData,
  SelectedData,
}) => {
  const [formData, setFormData] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    questionType: "SINGLE_ANSWER",
    questionLevel: "BASIC",
    answer: "",
    correctAnswers: [],
    marks: "",
  });

  // set data that has to edit
  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id || "",
        questionText: editData.questionText || "",
        optionA: editData.optionA || "",
        optionB: editData.optionB || "",
        optionC: editData.optionC || "",
        optionD: editData.optionD || "",
        questionType: editData.questionType || "",
        questionLevel: editData.questionLevel || "",
        answer: editData.answer || "",
        correctAnswers: editData.correctAnswers || "",
        marks: editData.marks || "",
      });
    }
  }, [editData]);

  // on chnage event
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // on chnage event for dropdown
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      answer: value !== "TRUE_FALSE" ? formData.answer : "",
      correctAnswers: value === "MULTIPLE_ANSWER" ? formData.correctAnswers : [],
      optionA: value === "TRUE_FALSE" ? "True" : "",
      optionB: value === "TRUE_FALSE" ? "False" : "",
    });
  };

  // on chnage event for dropdown question level
  const handleSelectChangeQ = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // on submit event
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      questionText: formData.questionText,
      optionA: formData.optionA,
      optionB: formData.optionB,
      optionC: formData.optionC,
      optionD: formData.optionD,
      questionType: formData.questionType,
      questionLevel: formData.questionLevel,
      answer: formData.answer,
      correctAnswers: formData.correctAnswers,
      marks: formData.marks,
    };
    await axios
      .put(api + `/newskill/questionUpdate/${formData.id}`, payload)
      .then(async (response) => {
        const updatedArray = SelectedData.questions.map((obj) =>
          obj.id === response.data.question.id ? response.data.question : obj
        );
        setSelectedData((prev) => {
          return { ...prev, questions: updatedArray };
        });
        handleClose();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Question Update Successfully.",
          showConfirmButton: true,
        }).then(async () => {
          getTestDataApi();
        });
      })
      .catch((error) => {
        handleClose();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to edit question. Please try again later.",
          showConfirmButton: true,
        });
      });
  };

  return (
    <Modal open={isEditModalOpen}>
      <Box
        sx={{
          width: { xs: "95%", sm: "95%", md: "80%", lg: "70%", xl: "50%" },
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
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
          <div>
            <h3>Update Question</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Grid container with spacing between items */}
              <Grid item xs={12}>
                {/* Full width item */}
                <TextField
                  name="questionText"
                  value={formData.questionText}
                  onChange={handleChange}
                  label="Question Name"
                  variant="outlined"
                  required
                  fullWidth
                />
              </Grid>{" "}
              <Grid item xs={12} sm={12} md={4} lg={4}>
                {/* Half width item */}
                <FormControl fullWidth sx={{ mt: 0.5, ml: 1 }}>
                  <InputLabel>Question Type *</InputLabel>
                  <Select
                    label="Question Type *"
                    name="questionType"
                    value={formData.questionType}
                    onChange={handleSelectChange}
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ padding: "12px !important", mt: 0.5 }}
                  >
                    <MenuItem value="SINGLE_ANSWER">Single Choice</MenuItem>
                    <MenuItem value="MULTIPLE_ANSWER">Multiple Choice</MenuItem>
                    <MenuItem value="TRUE_FALSE">True False</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                {/* Half width item */}
                <FormControl fullWidth sx={{ mt: 0.5, ml: 1 }}>
                  <InputLabel>Question Level *</InputLabel>
                  <Select
                    label="Question Level *"
                    name="questionLevel"
                    value={formData.questionLevel}
                    onChange={handleSelectChangeQ}
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ padding: "12px !important", mt: 0.5 }}
                  >
                    <MenuItem value="BASIC">BASIC</MenuItem>
                    <MenuItem value="INTERMEDIATE">INTERMEDIATE</MenuItem>
                    <MenuItem value="ADVANCED">ADVANCED</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  name="marks"
                  value={formData.marks}
                  onChange={handleChange}
                  label="Marks"
                  type="number"
                  variant="outlined"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                {/* Half width item */}
                <TextField
                  name="optionA"
                  value={formData.optionA}
                  onChange={handleChange}
                  label="Option A"
                  type="text"
                  variant="outlined"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                {/* Half width item */}
                <TextField
                  name="optionB"
                  value={formData.optionB}
                  onChange={handleChange}
                  label="Option B"
                  type="text"
                  variant="outlined"
                  required
                  fullWidth
                />
              </Grid>
              {formData.questionType !== "TRUE_FALSE" && (
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  {/* Half width item */}
                  <TextField
                    name="optionC"
                    value={formData.optionC}
                    onChange={handleChange}
                    label="Option C"
                    type="text"
                    variant="outlined"
                    required={formData.questionType === "TRUE_FALSE" ? false : true}
                    fullWidth
                  />
                </Grid>
              )}
              {formData.questionType !== "TRUE_FALSE" && (
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  {/* Half width item */}
                  <TextField
                    name="optionD"
                    value={formData.optionD}
                    onChange={handleChange}
                    label="Option D"
                    type="text"
                    variant="outlined"
                    required={formData.questionType === "TRUE_FALSE" ? false : true}
                    fullWidth
                  />
                </Grid>
              )}
              {formData.questionType !== "MULTIPLE_ANSWER" && (
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <FormControl fullWidth variant="outlined" required sx={{ mt: 1, ml: 1 }}>
                    <InputLabel>Correct Answer</InputLabel>
                    <Select
                      name="answer"
                      value={formData.answer}
                      onChange={handleChange}
                      label="Correct Answer"
                      sx={{ padding: "12px !important" }}
                    >
                      <MenuItem value="A">A</MenuItem>
                      <MenuItem value="B">B</MenuItem>
                      {formData.questionType !== "TRUE_FALSE" && <MenuItem value="C">C</MenuItem>}
                      {formData.questionType !== "TRUE_FALSE" && <MenuItem value="D">D</MenuItem>}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              {formData.questionType === "MULTIPLE_ANSWER" && (
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <FormControl fullWidth variant="outlined" required sx={{ mt: 1, ml: 1 }}>
                    <InputLabel>Correct Answers</InputLabel>
                    <Select
                      multiple
                      label="Correct Answers"
                      name="correctAnswers"
                      value={formData.correctAnswers}
                      sx={{ padding: "12px !important" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          correctAnswers: e.target.value,
                        })
                      }
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200, // Adjust height if needed
                          },
                        },
                        disableAutoFocusItem: true, // Prevents auto-focus issues
                      }}
                    >
                      {["A", "B", "C", "D"].map((option) => (
                        <MenuItem
                          key={option}
                          value={option}
                          onClick={(e) => e.stopPropagation()} // Prevents dropdown from closing
                          sx={{ padding: "0", mb: 0.3 }}
                        >
                          <Checkbox
                            sx={{
                              transform: "scale(0.7)", // Increase checkbox size
                            }}
                            checked={formData.correctAnswers.includes(option)}
                          />
                          <ListItemText primary={option} sx={{ "& span": { fontSize: 14 } }} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}>
                {/* Full width item */}
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
              </Grid>
            </Grid>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

EditQueTest.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isEditModalOpen: PropTypes.boolean,
  getTestDataApi: PropTypes.func.isRequired,
  editData: PropTypes.object.isRequired,
  setSelectedData: PropTypes.object.isRequired,
  SelectedData: PropTypes.object.isRequired,
};

export default EditQueTest;
