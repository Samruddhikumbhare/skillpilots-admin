import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  FormControl,
  Typography,
  Box,
  Modal,
  CircularProgress,
  Card,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { api } from "../../Api";
import { DataGrid } from "@mui/x-data-grid"; // Assuming you're using DataGrid from Material-UI
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";

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
function TechnologyPage({ searchString }) {
  const [formData, setFormData] = useState({
    technology_name: "",
  });

  const [formErrors, setFormErrors] = useState({
    technology_name: "",
  });

  const [data, setData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTechData, setEditTechData] = useState(null);
  const [filterdata, setFilterData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  const [disableButton, setDisableButton] = useState(true);

  useEffect(() => {
    setLoader(true);
    getTechnologyDataApi()
      .then((formattedData) => {
        setData(formattedData);
        setLoader(false);
        setFilterData(formattedData);
      })
      .catch((err) => {
        setLoader(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.technology_name) errors.technology_name = "Technology Name is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post(api + "/newskill/createTech", formData);
        // console.log("Form submitted successfully", response.data);
        console.log("response", response);
        getTechnologyDataApi().then((formattedData) => setData(formattedData));

        setFormData({ technology_name: "" }); // Clear form after submission
        const Toast = Swal.mixin({
          toast: true,
          position: "center",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });

        Toast.fire({
          icon: "success",
          title: "Technology Added Successfully.",
        });
      } catch (error) {
        console.error("Error submitting form", error);
      }
    }
  };

  const getTechnologyDataApi = async () => {
    try {
      const res = await axios.get(api + "/newskill/getTech");
      const formattedData = res.data.technologies.map((row, index) => ({
        ...row,
        id: index + 1,
      }));
      return formattedData;
    } catch (err) {
      console.log("Error fetching technologies", err);
      throw err;
    }
  };

  const handleDelete = async (tech_id) => {
    try {
      await axios.delete(api + `/newskill/deleteTech?tech_id=${tech_id}`);
      getTechnologyDataApi().then((formattedData) => setData(formattedData));
      alert("Technology Deleted Successfully");
    } catch (err) {
      console.log("Error deleting technology:", err);
    }
  };

  const handleEdit = (tech_id) => {
    const techData = data.find((row) => row.tech_id === tech_id);
    setEditTechData(techData);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(api + `/newskill/editTech?tech_id=${editTechData?.tech_id}`, editTechData);
      setEditModalOpen(false);
      getTechnologyDataApi().then((formattedData) => setData(formattedData));

      const Toast = Swal.mixin({
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: "success",
        title: "Technology Updated Successfully.",
      });
    } catch (error) {
      console.error("Error updating technology", error);
    }
  };
  useEffect(() => {
    if (searchString == "") {
      setData(filterdata);
    } else {
      const filterdatalist = data.filter((entry) =>
        entry?.technology_name.toLowerCase().includes(searchString.toLowerCase())
      );

      setData(filterdatalist);
    }
  }, [searchString]);

  function exportToExcel(data, fileName = "data.xlsx") {
    const headerMap = {
      technology_name: "Technology Name",
    };

    // Extract custom headers dynamically
    const headers = Object.values(headerMap);

    // Convert data objects into an array of arrays
    const rows = data.map((item) => Object.keys(headerMap).map((key) => item[key] || ""));

    // Combine headers and rows
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
  }

  const handleDownload = () => {
    exportToExcel(data, "Technology.xlsx");
  };
  const handleCloseModal = () => {
    setEditModalOpen(false);
    setEditTechData(null);
  };
  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };
  const columns = [
    { sortable: false, field: "technology_name", headerName: "Technology Name", width: 300 },
    {
      sortable: false,
      field: "deleteAction",
      headerName: "Delete",
      width: 150,
      renderCell: (params) => (
        <IconButton
          data-toggle="tooltip"
          title="Delete"
          color="error"
          onClick={() => handleDelete(params.row.tech_id)}
        >
          <i
            className="fa fa-trash"
            style={{ fontSize: "17px", color: "red" }}
            aria-hidden="true"
          ></i>
          {/* Delete */}
        </IconButton>
      ),
    },
    {
      sortable: false,
      field: "editAction",
      headerName: "Edit",
      width: 150,
      renderCell: (params) => (
        <IconButton
          data-toggle="tooltip"
          title="Edit"
          color="error"
          onClick={() => handleEdit(params.row.tech_id)}
        >
          <i
            className="fa fa-pencil"
            style={{ fontSize: "17px", color: "green" }}
            aria-hidden="true"
          ></i>
          {/* Edit */}
        </IconButton>
      ),
    },
  ];
  useEffect(() => {
    if (formData.technology_name == "") {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [formData]); // Only re-run effect if searchTerm changes
  return (
    <>
      <Card sx={{ p: 1, mb: 6 }}>
        <Container maxWidth="sm">
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Add Technology
            </Typography>
            <hr />
            <br />
            <form onSubmit={handleSubmit} noValidate>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <FormControl sx={{ minWidth: 200 }}>
                  <TextField
                    label="Technology Name"
                    name="technology_name"
                    value={formData.technology_name}
                    onChange={handleChange}
                    error={Boolean(formErrors.technology_name)}
                    helperText={formErrors.technology_name}
                    fullWidth
                  />
                </FormControl>

                <Button
                  type="submit"
                  style={disableButton ? style.disablebutton : style.enableButton}
                  variant="contained"
                  color="error"
                  disabled={disableButton}
                  sx={{ minWidth: 100 }}
                >
                  Submit
                </Button>
              </Box>
            </form>
          </Box>
        </Container>
      </Card>

      <Card sx={{ p: 1, pt: 2 }}>
        <div style={{ width: "100%" }}>
          <div style={{ paddingBottom: "10px", display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color=""
              style={{ backgroundColor: "#78b7f2", color: "white" }}
              onClick={handleDownload}
            >
              Download Excel
            </Button>
          </div>
          {loader ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress color="info" />
            </div>
          ) : data.length > 0 ? (
            <DataGrid
              rows={[...data].reverse()}
              columns={columns}
              rowsPerPageOptions={[5, 10, 25]}
              pagination
              disableColumnMenu
              sx={{
                "& .MuiDataGrid-columnSeparator": {
                  display: "none !important", // Hide the column resize handles
                },
              }}
              getRowId={(row) => row.id} // Specify the id property for each row
              paginationModel={paginationModel} // Make sure this is initialized correctly
              pageSize={paginationModel.pageSize}
              onPaginationModelChange={handlePaginationChange}
            />
          ) : (
            <div style={{ padding: "10px 15px", fontSize: "18px", fontWeight: "600" }}>
              Not found
            </div>
          )}
        </div>
      </Card>
      <Modal
        open={editModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="edit-tech-modal-title"
        aria-describedby="edit-tech-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "5px",
            p: 4,
          }}
        >
          <Typography id="edit-tech-modal-title" variant="h6" component="h2">
            Edit Technology
            {/* (ID: {editTechData?.tech_id})          show id on modal */}
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            label="Technology Name"
            name="technology_name"
            value={editTechData?.technology_name || ""}
            onChange={(e) => setEditTechData({ ...editTechData, technology_name: e.target.value })}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button
              onClick={handleSaveEdit}
              variant="contained"
              sx={{ mr: 2, color: "white !important" }}
            >
              Save
            </Button>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              sx={{ color: "white !important" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
TechnologyPage.propTypes = {
  searchString: PropTypes.string, // Ensure it's a required string
};
TechnologyPage.defaultProps = {
  searchString: "",
};
export default TechnologyPage;
