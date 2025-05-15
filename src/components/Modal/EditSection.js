// start on 17 march 2025 by medha

import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import axios from "axios";
import { api } from "../../Api";
import { Modal, Box, Grid } from "@mui/material";
import Swal from "sweetalert2";

const EditSection = ({ editData, handleClose, getTestDataApi, isEditModalOpen }) => {
  const [formData, setFormData] = useState({
    id: "",
    sectionName: "",
  });

  // set data that has to edit
  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id || "",
        sectionName: editData.sectionName || "",
      });
    }
  }, [editData]);

  // on chnage event
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // on submit event
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      sectionName: formData.sectionName,
    };

    await axios
      .put(api + `/newskill/section/${formData.id}`, payload)
      .then(async (response) => {
        handleClose();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Section Update Successfully.",
          showConfirmButton: true,
        }).then(async () => {
          getTestDataApi();
          // window.location.reload();
        });
      })
      .catch((error) => {
        handleClose();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to edit Section. Please try again later.",
          showConfirmButton: true,
        });
      });
  };

  return (
    <Modal open={isEditModalOpen}>
      <Box
        sx={{
          width: { xs: "95%", sm: "80%", md: "60%", lg: "30%" },
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
          <h3>Edit Section</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <TextField
                  sx={{ mb: 2 }}
                  name="sectionName"
                  value={formData.sectionName}
                  onChange={handleChange}
                  label="Section Name"
                  variant="outlined"
                  required
                  fullWidth
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

EditSection.propTypes = {
  editData: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  getTestDataApi: PropTypes.func.isRequired,
  isEditModalOpen: PropTypes.boolean,
};

export default EditSection;
