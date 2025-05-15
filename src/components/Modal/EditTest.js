import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import axios from "axios";
import { api } from "../../Api";
import { FormControlLabel, RadioGroup, Radio, Modal, Box } from "@mui/material";

const CrudModal = styled("div")({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  maxWidth: "90%",
  width: "400px",
  zIndex: "1000",
  "& .MuiTextField-root": {
    margin: "8px",
    width: "calc(50% - 16px)",
  },
  "& .MuiButton-root": {
    margin: "8px",
  },
});

const convertToDateInputFormat = (dateStr) => {
  if (!dateStr || dateStr === "N/A") return ""; // Handle empty or "N/A" cases
  const [day, month, year] = dateStr.split("-").map(Number);
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`; // Format for input type="date"
};

const EditTest = ({ editData, handleClose, getOnlineTestDataApi, isEditModalOpen }) => {
  const [formData, setFormData] = useState({
    tesId: "",
    testName: "",
    cut_off: "",
    time: "",
    total_mark: "",
    total_que: "",
    creation_date: "",
    expiration_date: "",
    status: false,
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        tesId: editData.tesId || "",
        testName: editData.testName || "",
        cut_off: editData.cut_off || "",
        time: editData.time || "",
        total_mark: editData.total_mark || "",
        total_que: editData.total_que || "",
        creation_date: convertToDateInputFormat(editData.creation_date),
        expiration_date:
          editData.expiration_date !== "N/A"
            ? convertToDateInputFormat(editData.expiration_date)
            : "",
        status: editData.status || false,
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // setFormData({
    //   ...formData,
    //   [name]: type === "checkbox" ? checked : value,
    // });
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        testName: formData.testName,
        cut_off: formData.cut_off,
        time: formData.time,
        total_mark: formData.total_mark,
        total_que: formData.total_que,
        creation_date: formData.creation_date,
        expiration_date: formData.expiration_date,
        // status: formData.status,
      };

      const response = await axios.put(
        `${api}/newskill/editTest?testId=${formData.tesId}`,
        payload
      );
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
    <Modal open={isEditModalOpen}>
      <CrudModal>
        <h3>Edit Test Details</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <TextField
              sx={{ mb: 2 }}
              name="testName"
              value={formData.testName}
              onChange={handleChange}
              label="Test Name"
              variant="outlined"
              required
            />
            <TextField
              sx={{ mb: 2 }}
              name="cut_off"
              value={formData.cut_off}
              onChange={handleChange}
              label="Cut Off"
              variant="outlined"
              type="number"
              required
            />
            <TextField
              sx={{ mb: 2 }}
              name="time"
              value={formData.time}
              onChange={handleChange}
              label="Time (mins)"
              variant="outlined"
              type="number"
              required
            />
            <TextField
              sx={{ mb: 2 }}
              name="total_mark"
              value={formData.total_mark}
              onChange={handleChange}
              label="Total Marks"
              variant="outlined"
              type="number"
              required
            />
            <TextField
              sx={{ mb: 2 }}
              name="total_que"
              value={formData.total_que}
              onChange={handleChange}
              label="Total Questions"
              variant="outlined"
              type="number"
              required
            />
            <TextField
              sx={{ mb: 2 }}
              name="creation_date"
              value={formData.creation_date}
              onChange={handleChange}
              label="Creation Date"
              variant="outlined"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              sx={{ mb: 2 }}
              name="expiration_date"
              value={formData.expiration_date}
              onChange={handleChange}
              label="Expiration Date"
              variant="outlined"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            {/* <RadioGroup name="status" value={formData.status.toString()} onChange={handleChange} row>
            <FormControlLabel value="true" control={<Radio />} label="Active" />
            <FormControlLabel value="false" control={<Radio />} label="Inactive" />
          </RadioGroup> */}
          </div>
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
      </CrudModal>
    </Modal>
  );
};

EditTest.propTypes = {
  editData: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  getOnlineTestDataApi: PropTypes.func.isRequired,
  isEditModalOpen: PropTypes.boolean,
};

export default EditTest;
