import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for the loader
import axios from "axios";
import PropTypes from "prop-types";
import { api } from "../../Api";
import { Box, Modal } from "@mui/material";

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
  "& .MuiButton-root": {
    margin: "8px",
  },
});

const UploadQue = ({ selectedRowId, handleClose, isUploadModalOpen }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // State for loader

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("testId", selectedRowId); // Append the testId to the form data

    setLoading(true); // Show loader when upload starts
    try {
      const response = await axios.post(
        `${api}/newskill/upload?testId=${selectedRowId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully:", response.data);
      alert("File uploaded successfully.");
      handleClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    } finally {
      setLoading(false); // Hide loader after response
    }
  };

  return (
    <Modal open={isUploadModalOpen}>
      <CrudModal>
        <div>
          <h3>Upload Excel File</h3>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* File input field */}
              <Grid item xs={12}>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  required
                  style={{ width: "100%" }}
                  disabled={loading} // Disable input during loading
                />
              </Grid>
              <Grid item xs={12}>
                {/* Full width item */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ color: "white !important" }}
                    disabled={loading} // Disable button during loading
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null} // Add loader icon to button
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    sx={{ color: "white !important" }}
                    onClick={handleClose}
                    disabled={loading} // Disable close button during loading
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

UploadQue.propTypes = {
  selectedRowId: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired,
  isUploadModalOpen: PropTypes.boolean,
};

export default UploadQue;
