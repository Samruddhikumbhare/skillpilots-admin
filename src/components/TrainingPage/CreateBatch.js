import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  FormControl,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "layouts/authentication/components/Footer";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import AddQue from "components/Modal/AddQue";
import EditTest from "components/Modal/EditTest";
import { api } from "../../Api";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

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

function CreateBatch() {
  // State for form data
  const [formData, setFormData] = useState({
    batchName: "",
    duration: "",
    batchStartdate: "",
    batchEnddate: "",
  });

  // State for form errors
  const [formErrors, setFormErrors] = useState({
    batchName: "",
    duration: "",
    batchStartdate: "",
    batchEnddate: "",
  });
  const [disableButton, setDisableButton] = useState(true);
  // State for data, modal visibility, and selected row
  const [data, setData] = useState([]); // Initialize data state to an empty array
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [filterdata, setFilterData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });

  useEffect(() => {
    TestList();
  }, []);
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (
      formData.batchName == "" ||
      formData.batchEnddate == "" ||
      formData.batchStartdate == "" ||
      formData.duration == ""
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [formData]); // Only re-run effect if searchTerm changes
  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(api + "/newskill/batch", formData);
      Swal.fire({ icon: "success", title: "Success!", text: "Form submitted successfully." });
      TestList();
      // Handle success, e.g., reset form or show a success message
    } catch (error) {
      console.error("There was an error submitting the form", error);
      // Handle error, e.g., show an error message
    }
  };

  // Fetch test data from API
  const getOnlineTestDataApi = async () => {
    try {
      const res = await axios.get(api + "/newskill/allBatches");
      console.log("Fetched data:", res.data);
      const formattedData = res.data.students.map((row, index) => ({
        id: row.batchId, // Use batchId as the unique ID, or generate one if batchId is not unique
        batchId: row.batchId,
        batchName: row.batchName,
        creationDate: formatDate(row.crationDate),
        expirationDate: row.batchEnddate ? formatDate(row.batchEnddate) : "N/A",
        duration: row.duration,
        batchStartDate: formatDate(row.batchStartdate),
        traineeAssignments: row.traineeAssignments,
      }));
      return formattedData;
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
    }
  };

  // Load test data
  const TestList = () => {
    setLoader(true);
    getOnlineTestDataApi()
      .then((formattedData) => {
        setLoader(false);
        setData(formattedData); // Correctly set the data state
        setFilterData(formattedData);
        console.log("Formatted data:", formattedData);
      })
      .catch((error) => {
        setLoader(false);
        console.error("Error fetching data:", error);
      });
  };
  const handleChangeSerch = (search) => {
    if (search == "") {
      setData(filterdata);
    } else {
      const filterdatalist = data.filter(
        (entry) =>
          entry?.batchName.toLowerCase().includes(search.toLowerCase()) ||
          entry?.batchStartDate.toLowerCase().includes(search.toLowerCase()) ||
          entry?.duration.toString().toLowerCase().includes(search.toLowerCase()) ||
          entry?.batchStartDate.toLowerCase().includes(search.toLowerCase())
      );

      setData(filterdatalist);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Handle save after editing
  const handleSave = () => {
    // Implement save logic here
    TestList(); // Refresh data after saving
  };
  function exportToExcel(data, fileName = "data.xlsx") {
    const headerMap = {
      batchName: "Batch Name",
      creationDate: "Creation Date",
      expirationDate: "Expiration Date",
      duration: "Duration (Months)",
      batchStartDate: "Batch Start Date",
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
    exportToExcel(data, "Batch.xlsx");
  };
  const columns = [
    { sortable: false, field: "batchName", headerName: "Batch Name", width: 250 },
    { sortable: false, field: "creationDate", headerName: "Creation Date", width: 150 },
    { sortable: false, field: "expirationDate", headerName: "Expiration Date", width: 150 },
    { sortable: false, field: "duration", headerName: "Duration (Months)", width: 150 },
    { sortable: false, field: "batchStartDate", headerName: "Batch Start Date", width: 150 },
    // Add more columns as needed
  ];

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar onDataSend={handleChangeSerch} />
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card sx={{ p: 2, pt: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Create Batch
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
                        label="Batch Name"
                        name="batchName"
                        value={formData.batchName}
                        onChange={handleChange}
                        error={Boolean(formErrors.batchName)}
                        helperText={formErrors.batchName}
                        fullWidth
                      />
                    </FormControl>
                    <FormControl sx={{ minWidth: 200 }}>
                      <TextField
                        label="Duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        error={Boolean(formErrors.duration)}
                        helperText={formErrors.duration}
                        fullWidth
                      />
                    </FormControl>
                    <FormControl sx={{ minWidth: 200 }}>
                      <TextField
                        label="Start Date"
                        type="date"
                        name="batchStartdate"
                        value={formData.batchStartdate}
                        onChange={handleChange}
                        error={Boolean(formErrors.batchStartdate)}
                        helperText={formErrors.batchStartdate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </FormControl>
                    <FormControl sx={{ minWidth: 200 }}>
                      <TextField
                        label="End Date"
                        type="date"
                        name="batchEnddate"
                        value={formData.batchEnddate}
                        onChange={handleChange}
                        error={Boolean(formErrors.batchEnddate)}
                        helperText={formErrors.batchEnddate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={disableButton}
                      style={disableButton ? style.disablebutton : style.enableButton}
                      color="success"
                      sx={{ minWidth: 100 }}
                    >
                      Submit
                    </Button>
                  </Box>
                </form>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card sx={{ p: 1, pt: 2 }}>
                <div style={{ width: "100%" }}>
                  <div
                    style={{ paddingBottom: "10px", display: "flex", justifyContent: "flex-end" }}
                  >
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
                      rows={data}
                      columns={columns}
                      rowsPerPageOptions={[5, 10, 25]}
                      pagination
                      disableColumnMenu
                      sx={{
                        "& .MuiDataGrid-columnSeparator": {
                          display: "none !important", // Hide the column resize handles
                        },
                      }}
                      getRowId={(row) => row.id}
                      paginationModel={paginationModel} // Make sure this is initialized correctly
                      pageSize={paginationModel.pageSize}
                      onPaginationModelChange={handlePaginationChange}
                    />
                  ) : (
                    <div style={{ padding: "10px 15px", fontSize: "18px", fontWeight: "600" }}>
                      Not found
                    </div>
                  )}

                  {isAddModalOpen && (
                    <AddQue
                      selectedRowId={selectedRowId}
                      handleClose={() => setIsAddModalOpen(false)}
                    />
                  )}

                  {isEditModalOpen && editData && (
                    <EditTest
                      editData={editData}
                      handleClose={() => setIsEditModalOpen(false)}
                      handleSave={handleSave}
                      getOnlineTestDataApi={TestList}
                    />
                  )}
                </div>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
      </DashboardLayout>
    </div>
  );
}

export default CreateBatch;
