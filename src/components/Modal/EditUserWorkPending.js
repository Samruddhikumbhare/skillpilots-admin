import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import axios from "axios";
import { api } from "../../Api";










// ----------------------edit user modal work pending--------------------------------------------










const CrudModal = styled("div")({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#dfe3eb",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  maxWidth: "90%",
  width: "400px",
  zIndex: "1000",
  "& .MuiTextField-root": {
    margin: "8px",
    width: "calc(50% - 16px)", // Adjust width here
  },
  "& .MuiButton-root": {
    margin: "8px",
  },
});

const EditQue = ({ editData, handleClose, getOnlineTestDataApi }) => {
  const [formData, setFormData] = useState(editData);

  useEffect(() => {
    setFormData(editData);
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        text: formData.text,
        option1: formData.option1,
        option2: formData.option2,
        option3: formData.option3,
        option4: formData.option4,
        correctAnswer: formData.correctAnswer,
      };

      const response = await axios.put(`${api}/newskill/editQuestion?id=${formData.id}`, payload);
      console.log("Form submitted successfully", response.data);
      alert("Data Updated");
      handleClose();
      getOnlineTestDataApi();
    } catch (error) {
      console.error("There was an error submitting the form", error);
      alert("Failed to update data. Please try again.");
    }
  };

  return (
    <CrudModal>
      <h3>Edit Question</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {/* ID Field (Hidden Input) */}
          <input type="hidden" name="id" value={formData.id} />

          {/* Question Field */}
          <TextField
            name="text"
            value={formData.text}
            onChange={handleChange}
            label="Question"
            variant="outlined"
            required
          />

          {/* Option 1 */}
          <TextField
            name="option1"
            value={formData.option1}
            onChange={handleChange}
            label="Option 1"
            variant="outlined"
            required
          />

          {/* Option 2 */}
          <TextField
            name="option2"
            value={formData.option2}
            onChange={handleChange}
            label="Option 2"
            variant="outlined"
            required
          />

          {/* Option 3 */}
          <TextField
            name="option3"
            value={formData.option3}
            onChange={handleChange}
            label="Option 3"
            variant="outlined"
            required
          />

          {/* Option 4 */}
          <TextField
            name="option4"
            value={formData.option4}
            onChange={handleChange}
            label="Option 4"
            variant="outlined"
            required
          />

          {/* Correct Answer */}
          <TextField
            name="correctAnswer"
            value={formData.correctAnswer}
            onChange={handleChange}
            label="Correct Answer"
            variant="outlined"
            required
          />
        </div>

        {/* Save Button */}
        <Button type="submit" variant="contained" color="error">
          Save
        </Button>

        {/* Close Button */}
        <Button type="button" variant="contained" color="error" onClick={handleClose}>
          Close
        </Button>
      </form>
    </CrudModal>
  );
};

EditQue.propTypes = {
  editData: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  getOnlineTestDataApi: PropTypes.func.isRequired,
};

export default EditQue;
