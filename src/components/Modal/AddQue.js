import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid"; // Import Grid component from Material-UI
import axios from "axios";
import PropTypes from "prop-types";
import { api } from "../../Api";
import { Box, Modal } from "@mui/material";

const CrudModal = styled("div")({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#dfe3eb",
  padding: "20px",
  borderRadius: "8px",
  background: "white",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  maxWidth: "90%",
  width: "400px",
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
});

const AddQue = ({ selectedRowId, handleClose, isAddModalOpen }) => {
  const [formData, setFormData] = useState({
    text: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    type: "SINGLE_CHOICE",
    correctAnswer: "",
    correctAnswers: [],
    marks: "",
    difficultyLevel: "Medium",
    testId: selectedRowId,
    marksque: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        api + `/newskill/addQues?testId=${selectedRowId}`,
        formData
      );
      console.log("Data submitted successfully:", response.data);
      // Optionally, you can reset the form after successful submission
      setFormData({
        text: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        type: "SINGLE_CHOICE",
        correctAnswer: "",
        correctAnswers: [],
        marks: "",
        difficultyLevel: "Medium",
        testId: selectedRowId,
        marksque: "",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <Modal open={isAddModalOpen}>
      <CrudModal>
        <div>
          <div>
            <h3>Create New Question</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Grid container with spacing between items */}
              <Grid item xs={12}>
                {/* Full width item */}
                <TextField
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  label="Question Name"
                  variant="outlined"
                  placeholder="Type Question name"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                {/* Half width item */}
                <TextField
                  name="option1"
                  value={formData.option1}
                  onChange={handleChange}
                  label="Option 1"
                  type="text"
                  variant="outlined"
                  placeholder="Option 1"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                {/* Half width item */}
                <TextField
                  name="option2"
                  value={formData.option2}
                  onChange={handleChange}
                  label="Option 2"
                  type="text"
                  variant="outlined"
                  placeholder="Option 2"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                {/* Half width item */}
                <TextField
                  name="option3"
                  value={formData.option3}
                  onChange={handleChange}
                  label="Option 3"
                  type="text"
                  variant="outlined"
                  placeholder="Option 3"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                {/* Half width item */}
                <TextField
                  name="option4"
                  value={formData.option4}
                  onChange={handleChange}
                  label="Option 4"
                  type="text"
                  variant="outlined"
                  placeholder="Option 4"
                  required
                  fullWidth
                />
              </Grid>
              {formData.type === "SINGLE_CHOICE" && (
                <Grid item xs={6}>
                  {/* Half width item */}
                  <TextField
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleChange}
                    label="Correct Answer"
                    type="text"
                    variant="outlined"
                    placeholder="Correct Answer"
                    required
                    fullWidth
                  />
                </Grid>
              )}
              {formData.type === "MULTIPLE_CHOICE" && (
                <Grid item xs={6}>
                  {/* Half width item */}
                  <TextField
                    name="correctAnswers"
                    value={formData.correctAnswers.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        correctAnswers: e.target.value.split(", "),
                      })
                    }
                    label="Correct Answers"
                    type="text"
                    variant="outlined"
                    placeholder="Correct Answers"
                    required
                    fullWidth
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                {/* Half width item */}
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleSelectChange}
                  variant="outlined"
                  fullWidth
                  required
                  sx={{ padding: "12px !important", mt: 1 }}
                >
                  <MenuItem value="SINGLE_CHOICE">Single Choice</MenuItem>
                  <MenuItem value="MULTIPLE_CHOICE">Multiple Choice</MenuItem>
                  {/* <MenuItem value="TRUE_FALSE">True/False</MenuItem> */}
                </Select>
              </Grid>
              <Grid item xs={6}>
                {/* Half width item */}
                <TextField
                  name="marks"
                  value={formData.marks}
                  onChange={handleChange}
                  label="Marks"
                  type="number"
                  variant="outlined"
                  placeholder="Marks"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                {/* Half width item */}
                <Select
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  onChange={handleSelectChange}
                  variant="outlined"
                  fullWidth
                  required
                  sx={{ padding: "12px !important", mt: 1 }}
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6}>
                {/* Half width item */}
                <TextField
                  name="marksque"
                  value={formData.marksque}
                  onChange={handleChange}
                  label="Marks per Question"
                  type="number"
                  variant="outlined"
                  placeholder="Marks per Question"
                  required
                  fullWidth
                />
              </Grid>
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
      </CrudModal>
    </Modal>
  );
};

AddQue.propTypes = {
  selectedRowId: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired,
  isAddModalOpen: PropTypes.boolean,
};

export default AddQue;
