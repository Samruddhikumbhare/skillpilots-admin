import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Container,
  Box,
  Typography,
  FormControl,
  FormLabel,
  Button,
  TextField,
  Grid,
  Card,
  IconButton,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import axios from "axios";
import { api } from "../../Api";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import AddbannerData from "components/Modal/AddBannerData";
import * as XLSX from "xlsx";
import { Add } from "@mui/icons-material";

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
function StudyMaterial() {
  const [formData, setFormData] = useState({
    courseName: "",
    courseDuration: "",
    courseDescription: "",
    courseImageUrl: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null); // State for the selected row ID
  const [filterdata, setFilterData] = useState([]);
  const [LoaderList, setLoaderList] = useState(false);
  const [disableButton, setDisableButton] = useState(true);

  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  useEffect(() => {
    myList();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  useEffect(() => {
    if (
      formData.courseName == "" ||
      formData.courseDuration == "" ||
      formData.courseDescription == ""
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [formData]); // Only re-run effect if searchTerm changes

  function exportToExcel(data, fileName = "data.xlsx") {
    const headerMap = {
      courseName: "Course Name",
      courseDuration: "Course Duration",
      courseDescription: "Course Descripition",
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
    exportToExcel(data, "Study_Material.xlsx");
  };

  const handleChangesearch = (search) => {
    if (search == "") {
      setData(filterdata);
    } else {
      const filterdatalist = data.filter(
        (entry) =>
          entry?.courseName.toLowerCase().includes(search.toLowerCase()) ||
          entry?.courseDuration.toLowerCase().includes(search.toLowerCase()) ||
          entry?.courseDescription.toLowerCase().includes(search.toLowerCase())
      );

      setData(filterdatalist);
    }
  };
  const validateForm = () => {
    let errors = {};
    if (!formData.courseName) errors.courseName = "Course Name is required.";
    if (!formData.courseDuration) errors.courseDuration = "Course duration is required.";
    if (!formData.courseDescription) errors.courseDescription = "Course description is required.";
    if (!formData.courseImageUrl) errors.courseImageUrl = "Image upload is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append(
      "coursesEntity",
      new Blob(
        [
          JSON.stringify({
            courseName: formData.courseName,
            courseDuration: formData.courseDuration,
            courseDescription: formData.courseDescription,
          }),
        ],
        { type: "application/json" }
      )
    );
    formDataToSend.append("file", formData.courseImageUrl);

    setLoading(true);
    try {
      const response = await axios.post(`${api}/newskill/course`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({ icon: "success", title: "Success!", text: "Form submitted successfully." });
      setFormData({
        courseName: "",
        courseDuration: "",
        courseDescription: "",
        courseImageUrl: null,
      });
      setFormErrors({});
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "There was an error submitting the form.",
      });
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    // { sortable: false, field: "courseId", headerName: "Course Id", width: 150 },
    { sortable: false, field: "courseName", headerName: "Course Name", width: 250 },
    { sortable: false, field: "courseDuration", headerName: "Course Duration", width: 150 },
    { sortable: false, field: "courseDescription", headerName: "Course Description", width: 250 },
    {
      sortable: false,
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          color="info"
          size="small"
          onClick={() => {
            setSelectedRowId(params.row.id); // Set the selected row ID
            setIsAddModalOpen(true); // Open the modal
          }}
        >
          <Add />
        </IconButton>
      ),
    },
  ];

  const myList = () => {
    setLoaderList(true);
    getOnlineTestDataApi()
      .then((formattedData) => {
        setLoaderList(false);
        setData(formattedData);
        setFilterData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoaderList(false);
      });
  };

  const getOnlineTestDataApi = async () => {
    try {
      const res = await axios.get(api + "/newskill/getCourses");
      const formattedData = res.data.courses.map((row) => ({
        id: row.courseId,
        courseId: row.courseId,
        courseName: row.courseName,
        courseDuration: row.courseDuration,
        courseDescription: row.courseDescription,
      }));
      return formattedData;
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar onDataSend={handleChangesearch} />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, pt: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Assign Batch To Students
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
                  <TextField
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    error={Boolean(formErrors.courseName)}
                    label="Enter Course Name"
                    sx={{ minWidth: 200 }}
                    helperText={formErrors.courseName}
                  />

                  <TextField
                    name="courseDuration"
                    value={formData.courseDuration}
                    onChange={handleChange}
                    error={Boolean(formErrors.courseDuration)}
                    label="Enter Course Duration"
                    sx={{ minWidth: 200 }}
                    helperText={formErrors.courseDuration}
                  />

                  <TextField
                    name="courseDescription"
                    value={formData.courseDescription}
                    onChange={handleChange}
                    error={Boolean(formErrors.courseDescription)}
                    label="Course Description"
                    sx={{ minWidth: 200 }}
                    helperText={formErrors.courseDescription}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    sx={{ minWidth: 100 }}
                    disabled={disableButton}
                    style={disableButton ? style.disablebutton : style.enableButton}
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
                {LoaderList ? (
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
                    Data Not found
                  </div>
                )}
              </div>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {/* Add the modal here */}
      {isAddModalOpen && (
        <AddbannerData selectedRowId={selectedRowId} handleClose={() => setIsAddModalOpen(false)} />
      )}
    </DashboardLayout>
  );
}

export default StudyMaterial;
