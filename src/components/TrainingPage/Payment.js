import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Divider,
  CircularProgress,
  Grid,
  Card,
  InputLabel,
  IconButton,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import axios from "axios";
import { api } from "../../Api";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Visibility } from "@mui/icons-material";

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
function Payment() {
  const [students, setStudents] = useState([]);
  const [uid, setUid] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: "",
    paid: "",
    mode: "",
    instId: "",
    date: "",
    batchName: "",
    balance: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [fees, setFees] = useState("");
  const [alreadyPaid, setAlreadyPaid] = useState(0); // Initialize to 0
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [disableButton, setDisableButton] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  const resetForm = () => {
    setFormData({
      studentId: "",
      paid: "",
      mode: "",
      instId: "",
      date: "",
      batchName: "",
      balance: "",
    });
    setFees("");
    setAlreadyPaid(0); // Reset to 0
    setFormErrors({}); // Clear any previous errors
  };

  useEffect(() => {
    getOnlineTestDataApi();
  }, []);
  function exportToExcel(data, fileName = "data.xlsx") {
    const headerMap = {
      studentName: "Student Name",
      batchName: "Batch",
      instId: "Installment",
      paid: "Paid Amount",
      rid: "Receipt Id",
      mode: "Payment Mode",
      balance: "Balance Remaining",
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
    exportToExcel(data, "Payment.xlsx");
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
          entry?.studentName.toLowerCase().includes(search.toLowerCase()) ||
          entry?.batchName.toLowerCase().includes(search.toLowerCase()) ||
          entry?.mode.toLowerCase().includes(search.toLowerCase())
      );

      setData(filterdatalist);
    }
  };

  const getOnlineTestDataApi = async () => {
    try {
      const res = await axios.get(api + "/newskill/findStudents");
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Error fetching student data:", err);
    }
  };

  const getBatchAndFees = async () => {
    if (!uid) return;
    try {
      const res = await axios.get(api + `/newskill/getBatchAndFees?id=${uid}`);
      const paidAmount = res.data.tpaid || 0; // Set to 0 if null
      setFormData((prevData) => ({
        ...prevData,
        batchName: res.data.batch,
        balance: res.data.batchfees - paidAmount - (parseFloat(formData.paid) || 0), // Calculate balance
      }));
      setFees(res.data.batchfees);
      setAlreadyPaid(paidAmount); // Update alreadyPaid state
    } catch (err) {
      console.error("Error fetching batch and fees:", err);
    }
  };

  useEffect(() => {
    getBatchAndFees();
    getPaymentHistory();
  }, [uid]);
  useEffect(() => {
    if (
      formData.studentId == "" ||
      formData.paid == "" ||
      formData.mode == "" ||
      formData.instId == "" ||
      formData.date == "" ||
      formData.batchName == ""
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [formData]); // Only re-run effect if searchTerm changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });

    if (name === "studentId") {
      setUid(value);
    }
    if (name === "paid") {
      const enteredAmount = parseFloat(value) || 0;
      const feeAmount = parseFloat(fees) || 0;
      const currentBalance = feeAmount - alreadyPaid - enteredAmount; // Update balance calculation
      setFormData((prevData) => ({
        ...prevData,
        balance: currentBalance, // Update balance in formData
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};

    // Validate required fields
    for (const key in formData) {
      if (key !== "balance" && !formData[key]) {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
      }
    }

    // Set errors if any
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // API call to save form data
    try {
      const response = await axios.post(api + "/newskill/savePaid", formData);
      alert(response.data);
      resetForm();
      getPaymentHistory();
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("Failed to save payment.");
    }
  };
  const getPaymentHistory = async () => {
    setLoading(true); // Start loading
    try {
      const res = await axios.get(api + "/newskill/getAllPaidHistory");
      console.log("Fetched payment history:", res.data);
      console.log(data); // Check if data is correct

      // Map through the installments to set formatted data
      const formattedData = res.data.data.map((inst) => ({
        id: inst.id,
        studentId: inst.studentId || "N/A",
        studentName: inst.studentName || "N/A",
        batchName: inst.batchName || "N/A", // Use batchName instead of batchId
        instId: inst.instId || "N/A", // Installment ID
        paid: inst.paid || 0, // Amount paid
        rid: inst.rid || "N/A",
        mode: inst.mode || "N/A", // Payment mode (cash, etc.)
        // batchFees: inst.batchFees || 0, // Total fees for the batch
        balance: inst.balance || 0, // Remaining balance
      }));

      setData(formattedData); // Set formatted data to state
      setFilterData(formattedData);
    } catch (err) {
      console.error("Error fetching payment history:", err);
    } finally {
      setLoading(false); // Stop loading regardless of success or error
    }
  };
  const handleToggledownloadModal = (rid, studentName, studentId) => {
    const rowData = data.find(
      (row) => row.id === rid && row.studentName === studentName && row.studentId === studentId
    );
    navigate(`/invoice/${rid}/${studentName}/${studentId}`); // Make sure studentId is included
  };

  const columns = [
    // { sortable: false, field: "id", headerName: "ID", width: 20 },
    // { sortable: false, field: "studentId", headerName: "S-Id", width: 100 },
    { sortable: false, field: "studentName", headerName: "Student Name", width: 220 },
    { sortable: false, field: "batchName", headerName: "Batch", width: 200 },
    { sortable: false, field: "instId", headerName: "Installment", width: 150 },
    { sortable: false, field: "paid", headerName: "Paid Amount", width: 110 },
    { sortable: false, field: "rid", headerName: "Receipt Id", width: 110 },
    { sortable: false, field: "mode", headerName: "Payment Mode", width: 120 },
    { sortable: false, field: "balance", headerName: "Balance Remaining", width: 150 },
    {
      sortable: false,
      field: "actions",
      headerName: "Actions",
      width: 70,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          size="small"
          color="info"
          onClick={() =>
            handleToggledownloadModal(params.row.rid, params.row.studentName, params.row.studentId)
          }
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar onDataSend={handleChangesearch} />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, pt: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Payment Section
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
                    <InputLabel>Select Student</InputLabel>
                    <Select
                      label="Select Student"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      error={Boolean(formErrors.studentId)}
                      sx={{ padding: "12px !important" }}
                      fullWidth
                    >
                      <MenuItem value="" disabled>
                        Select
                      </MenuItem>
                      {students.map((student) => (
                        <MenuItem key={student[0]} value={student[0]}>
                          {student[1]}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.studentId && (
                      <Typography color="error">{formErrors.studentId}</Typography>
                    )}
                  </FormControl>

                  <TextField
                    label="Batch Name"
                    type="text"
                    name="batchName"
                    value={formData.batchName}
                    readOnly
                    sx={{ minWidth: 200 }}
                  />
                  <TextField
                    label="Batch Fees"
                    sx={{ minWidth: 200 }}
                    type="number"
                    value={fees}
                    readOnly
                  />
                  <TextField
                    type="number"
                    label="Already Paid"
                    sx={{ minWidth: 200 }}
                    value={alreadyPaid}
                    readOnly
                  />
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Select Installment</InputLabel>
                    <Select
                      label="Select Installment"
                      name="instId"
                      value={formData.instId}
                      onChange={handleChange}
                      error={Boolean(formErrors.instId)}
                      sx={{ padding: "12px !important" }}
                      fullWidth
                    >
                      <MenuItem value="" disabled>
                        Select Installment
                      </MenuItem>
                      <MenuItem value="Installment 1st">Installment 1st</MenuItem>
                      <MenuItem value="Installment 2nd">Installment 2nd</MenuItem>
                      <MenuItem value="Installment 3rd">Installment 3rd</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Enter Paying Amount"
                    type="number"
                    name="paid"
                    value={formData.paid}
                    onChange={handleChange}
                    error={Boolean(formErrors.paid)}
                    helperText={formErrors.paid}
                  />

                  <TextField
                    label="Payment Mode (Cash / Online)"
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    error={Boolean(formErrors.mode)}
                    helperText={formErrors.mode}
                    sx={{ minWidth: 250 }}
                  />

                  <TextField
                    label="Balance Amount"
                    type="number"
                    name="balance"
                    value={formData.balance}
                    readOnly
                    sx={{ minWidth: 200 }}
                  />

                  <TextField
                    type="date"
                    label="Payment Date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    error={Boolean(formErrors.date)}
                    helperText={formErrors.date}
                    sx={{ minWidth: 200 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    style={disableButton ? style.disablebutton : style.enableButton}
                    disabled={disableButton}
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
                {loading ? (
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
                ) : (
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
                )}
              </div>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Payment;
