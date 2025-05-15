// start on 17 march 2025 by medha

import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for the loader
import axios from "axios";
import PropTypes from "prop-types";
import { Box, Modal } from "@mui/material";
import Swal from "sweetalert2";
import { api } from "Api";
import * as XLSX from "xlsx";

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

const UploadQuestionExcelTest = ({
  selectedRowId,
  handleClose,
  isUploadModalOpen,
  selectedTestId,
  getTestDataApi,
}) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // State for loader

  // handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    readExcel(e.target.files[0]);
  };

  const readExcel = (file) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet data to JSON
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      // setExcelData(parsedData);

      console.log("Parsed Excel Data:", parsedData);
    };
  };
  // on submit event for excel
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true); // Show loader when upload starts
    await axios
      .post(api + `/newskill/upload/${selectedTestId}/${selectedRowId}`, formData)
      .then(async (response) => {
        handleClose();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Question Upload Successfully.",
          showConfirmButton: true,
        }).then(async () => {
          getTestDataApi();
        });
      })
      .catch((error) => {
        console.log(error);
        handleClose();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data.includes("Invalid Correct Option")
            ? "Invalid Correct Option Selected For True False, Select A for True & B for False"
            : "Failed to upload question. Please try again later.",
          showConfirmButton: true,
        });
      });
  };

  return (
    <Modal open={isUploadModalOpen}>
      <CrudModal>
        <div>
          <h3>Upload Question Excel</h3>
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

UploadQuestionExcelTest.propTypes = {
  selectedRowId: PropTypes.number.isRequired,
  selectedTestId: PropTypes.number.isRequired,
  getTestDataApi: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  isUploadModalOpen: PropTypes.boolean,
};

export default UploadQuestionExcelTest;
