import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "layouts/authentication/components/Footer";
import * as XLSX from "xlsx";
import {
  Container,
  TextField,
  Button,
  FormControl,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Radio,
  MenuItem,
  Select,
  Card,
  Grid,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { api } from "../../Api";

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

import AddQue from "components/Modal/AddQue";
import EditTest from "components/Modal/EditTest";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import EditUser from "components/Modal/EditUser";
import { ThumbDown } from "@mui/icons-material";
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

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
const getOnlineTestDataApi = async () => {
  try {
    const res = await axios.get(api + "/newskill/allUsers");
    console.log("Fetched data:", res.data);

    // Check if students exist and is an array
    const students = Array.isArray(res.data.students) ? res.data.students : [];

    const formattedData = students.map((student) => ({
      id: student.userId || "N/A",
      tutorId: student.tutorId || "N/A",
      studentId: student.studentId || "N/A",
      name: student.name || "N/A",
      email: student.email || "N/A",
      mobNo: student.mobNo || "N/A",
      designation: student.designation || "Student",
      role: student.role || "N/A",
      createdDate: student.createdDate || "N/A",
      gender: student.gender || "N/A", // Default to "N/A" if null
      dob: student.dob ? new Date(student.dob).toLocaleDateString("en-US") : "N/A", // Default to "N/A" if null
      address: student.address || "N/A", // Default to "N/A" if null
      enabled: student.enabled || "N/A",
    }));

    return formattedData;
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err;
  }
};

function AddUsers() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    dob: "",
    mobNo: "",
    gender: "",
    role: "",
    designation: "",
    batch: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    address: "",
    dob: "",
    mobNo: "",
    gender: "",
    role: "",
    designation: "",
    batch: "",
  });
  const [disableButton, setDisableButton] = useState(true);
  const [validateNo, setValidateNo] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const validateForm = () => {
    let errors = {};
    if (!formData.testName) errors.testName = "testName is required";
    if (!formData.total_mark) errors.total_mark = "total_mark is required";
    if (!formData.total_que) errors.total_que = "total_que is required";
    if (!formData.time) errors.time = "time is required";
    if (!formData.cut_off) errors.cut_off = "cut_off is required";
    if (!formData.mark_per_que) errors.mark_per_que = "mark_per_que is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const resetFun = () => {
    setFormData({
      name: "",
      email: "",
      address: "",
      dob: "",
      mobNo: "",
      gender: "",
      role: "",
      designation: "",
      batch: "",
    });
  };

  // **************************mobile no validate*****************
  useEffect(() => {
    // const handler = setTimeout(() => {
    //   if (formData.mobNo == "") {
    //     setValidateNo("");
    //     setDisableButton(true);
    //   }
    //   else if (formData.mobNo.length !== 10) {
    //     setDisableButton(true);
    //     setValidateNo("Please enter valid 10 digit mobile number");
    //   } else {
    //     setValidateNo("");
    //     setDisableButton(false);
    //   }
    // }, 500);
    if (
      formData.address == "" ||
      formData.email == "" ||
      formData.dob == "" ||
      formData.gender == "" ||
      formData.role == "" ||
      formData.mobNo == ""
    ) {
      setValidateNo("");
      setDisableButton(true);
    } else if (formData.mobNo.length !== 10) {
      setDisableButton(true);
      setValidateNo("Please enter valid 10 digit mobile number");
    } else {
      setValidateNo("");
      setDisableButton(false);
    }
    // return () => {
    //   clearTimeout(handler); // Clear timeout if the user types again before 500ms
    // };
  }, [formData]); // Only re-run effect if searchTerm changes

  // useEffect(() => {
  //   if (
  //     formData.address == "" ||
  //     formData.email == "" ||
  //     formData.dob == "" ||
  //     formData.gender == "" ||
  //     formData.role == ""
  //   ) {
  //     setValidateNo("");
  //     setDisableButton(true);
  //   } else {
  //     setValidateNo("");
  //     setDisableButton(false);
  //   }
  // }, [formData]);
  // ******************************end**************************
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      Swal.fire({
        title: "Submitting...",
        text: "Please wait while we process your request.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      let response;
      // Check the role and determine which API to hit
      if (formData.role === "manager") {
        let data = {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          dob: formData.dob,
          mobNo: formData.mobNo,
          gender: formData.gender,
          role: formData.role,
          designation: formData.designation,
          batch: formData.batch,
        };
        response = await axios.post(api + "/newskill/addManager", data);
      } else if (formData.role === "tutor") {
        let data = {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          dob: formData.dob,
          mobNo: formData.mobNo,
          gender: formData.gender,
          role: formData.role,
          designation: formData.designation,
          batch: formData.batch,
        };
        if (data.designation == "") {
          data.designation = "tutor";
        }
        response = await axios.post(
          api + `/newskill/createTutor?batchIds=${formData.batch}&address=${formData.address}`,
          data
        );
      } else if (formData.role === "student") {
        let data = {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          dob: formData.dob,
          mobNo: formData.mobNo,
          gender: formData.gender,
          role: formData.role,
          designation: formData.designation,
          batch: formData.batch,
        };
        if (data.designation == "") {
          data.designation = "student";
        }

        response = await axios
          .post(api + "/newskill/createTraineeStudent", data)
          .then((res) => {
            console.log("res", res);
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Failed!",
              text: "",
            });
          });
      } else {
        console.warn("Role not supported or undefined");

        return;
      }

      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User Created Successfully.",
      });
      resetFun();
      TestList();
    } catch (error) {
      console.error("There was an error submitting the form", error);
      // Handle error, e.g., show an error message
    }
  };

  //   ---------------------------------------------------------------------------

  const [data, setData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [batches, setBatches] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  useEffect(() => {
    TestList();
    getBatches();
  }, []);

  function exportToExcel(data, fileName = "data.xlsx") {
    const headerMap = {
      name: "Name",
      email: "Email Id",
      address: "Address",
      designation: "Designation",
      dob: "Date of Birth",
      gender: "Gender",
      mobNo: "Mobile Number",
      role: "Role",
      createdDate: "Date",
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
    exportToExcel(data, "User.xlsx");
  };
  const TestList = () => {
    setLoader(true);
    getOnlineTestDataApi()
      .then((formattedData) => {
        setData(formattedData);
        setFilterData(formattedData);
        setLoader(false);
        console.log("Formatted data:", formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoader(false);
      });
  };
  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };
  const handleChangesearch = (search) => {
    if (search == "") {
      setData(filterdata);
    } else {
      const filterdatalist = data.filter(
        (entry) =>
          entry?.email.toLowerCase().includes(search.toLowerCase()) ||
          entry?.name.toLowerCase().includes(search.toLowerCase()) ||
          entry?.address.toLowerCase().includes(search.toLowerCase()) ||
          entry?.designation.toLowerCase().includes(search.toLowerCase()) ||
          entry?.gender.toLowerCase().includes(search.toLowerCase()) ||
          entry?.role.toLowerCase().includes(search.toLowerCase())
      );

      setData(filterdatalist);
    }
  };
  const handleToggleAddModal = (id) => {
    setSelectedRowId(id);
    setIsAddModalOpen(!isAddModalOpen);
  };

  const handleToggleEditModal = (item) => {
    const rowData = data.find((row) => row.id === item.id);
    setEditData(rowData);
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleDelete = async (item) => {
    if (item.role == "TUTOR") {
      axios
        .put(api + "/newskill/deactivateTutor?tutorId=" + item.tutorId)
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Tutor Deleted  Successfully.",
          });
          const updatedData = data.filter((row) => row.id !== item.id);
          setData(updatedData);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Delete Failed!",
            text: "",
          });
        });
    } else {
      axios
        .delete(api + `/newskill/deleteStudent?studentId=${item.id}`)
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Deleted  Successfully.",
          });
          const updatedData = data.filter((row) => row.id !== item.id);
          setData(updatedData);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Delete Failed!",
            text: "",
          });
        });
    }
  };
  const handleDeActivate = async (id, role) => {
    if (role == "TUTOR") {
      try {
        await axios.put(api + `/newskill/deactivateTutor?tutorId=${id}`);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Tutor De-Activated  Successfully.",
        });
        const updatedData = data.filter((row) => row.id !== id);
        setData(updatedData);
      } catch (error) {
        console.error("Error deleting test:", error);
      }
    } else {
      try {
        await axios.put(api + `/newskill/deactivate?userId=${id}`);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User De-Activated  Successfully.",
        });
        const updatedData = data.filter((row) => row.id !== id);
        setData(updatedData);
      } catch (error) {
        console.error("Error deleting test:", error);
      }
    }
  };

  const getBatches = async () => {
    axios
      .get(api + "/newskill/allBatches")
      .then((res) => {
        setBatches(res.data.students);
        console.log("Fetched data:", res.data.courses);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };
  const handleSave = (updatedRow) => {
    const updatedData = data.map((row) => (row.id === updatedRow.id ? updatedRow : row));
    setData(updatedData);
    setIsEditModalOpen(false);
  };
  const columns = [
    // { sortable: false, field:  "id", headerName: "ID", width: 70 },
    { sortable: false, field: "name", headerName: "Name", width: 150 },
    { sortable: false, field: "email", headerName: "Email", width: 200 },
    { sortable: false, field: "address", headerName: "Address", width: 150 },
    { sortable: false, field: "designation", headerName: "Designation", width: 100 },
    { sortable: false, field: "dob", headerName: "DOB", width: 120 },
    { sortable: false, field: "gender", headerName: "Gender", width: 70 },
    { sortable: false, field: "mobNo", headerName: "Mobile", width: 150 },
    { sortable: false, field: "role", headerName: "Role", width: 100 },
    {
      sortable: false,
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton
            data-toggle="tooltip"
            title="Edit"
            variant="contained"
            size="small"
            onClick={() => handleToggleEditModal(params.row)}
            style={{ marginRight: 8 }}
          >
            <i className="fa fa-pencil" style={{ color: "green" }} aria-hidden="true"></i>
          </IconButton>
          <IconButton
            variant="contained"
            data-toggle="tooltip"
            title="Delete"
            size="small"
            onClick={() => handleDelete(params.row)}
          >
            <i className="fa fa-trash" style={{ color: "red" }} aria-hidden="true"></i>
          </IconButton>
          &nbsp;
          <IconButton
            variant="contained"
            size="small"
            onClick={() => handleDeActivate(params.row.id, params.row.role)}
          >
            <ThumbDown />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar onDataSend={handleChangesearch} />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card sx={{ p: 2, pt: 2 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Create Users
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
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={Boolean(formErrors.name)}
                      helperText={formErrors.name}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl sx={{ minWidth: 200 }}>
                    <TextField
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={Boolean(formErrors.email)}
                      helperText={formErrors.email}
                      fullWidth
                    />
                  </FormControl>

                  <FormControl sx={{ minWidth: 200 }}>
                    <TextField
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      error={Boolean(formErrors.address)}
                      helperText={formErrors.address}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl sx={{ minWidth: 200 }}>
                    <TextField
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      error={Boolean(formErrors.dob)}
                      helperText={formErrors.dob}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </FormControl>
                  <FormControl sx={{ minWidth: 200 }}>
                    <TextField
                      label="Mobile"
                      name="mobNo"
                      type="number"
                      value={formData.mobNo}
                      onChange={handleChange}
                      error={Boolean(formErrors.mobNo)}
                      helperText={formErrors.mobNo}
                      fullWidth
                    />
                    <label style={{ fontSize: "12px", color: "red" }}>{validateNo}</label>
                  </FormControl>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ fontSize: "12px !important" }}>
                      Gender
                    </FormLabel>
                    <RadioGroup name="gender" value={formData.gender} onChange={handleChange} row>
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </RadioGroup>
                  </FormControl>
                  <FormControl sx={{ minWidth: 200 }}>
                    <Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      error={Boolean(formErrors.role)}
                      displayEmpty
                      fullWidth
                      required
                      sx={{ padding: "12px !important" }}
                    >
                      <MenuItem value="" disabled>
                        Select Role
                      </MenuItem>
                      {/* <MenuItem value="manager">Manager</MenuItem> */}
                      <MenuItem value="tutor">Tutor</MenuItem>
                      {/* <MenuItem value="support">Support</MenuItem> */}
                      <MenuItem value="student">Student</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 200 }}>
                    <TextField
                      label="Designation"
                      name="designation"
                      type="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      error={Boolean(formErrors.designation)}
                      helperText={formErrors.designation}
                      fullWidth
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    disabled={disableButton}
                    style={disableButton ? style.disablebutton : style.enableButton}
                    // style={{ backgroundColor: "green", color: "white" }}
                    variant="contained"
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
            <Card sx={{ p: 2, pt: 2 }}>
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
                  <EditUser
                    editData={editData}
                    handleClose={() => setIsEditModalOpen(false)}
                    handleSave={handleSave}
                    getOnlineTestDataApi={TestList}
                    isEditModalOpen={isEditModalOpen}
                  />
                )}
              </div>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default AddUsers;
