import React, { useEffect, useState } from "react";
import {
  CircularProgress,
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
} from "@mui/material";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import axios from "axios";
import { api } from "../../Api";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
function Payment() {
  const [students, setStudents] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    batchId: "",
    instId: "",
    paid: "",
    mode: "",
  });
  const [amt, setAmt] = useState(null);
  const [formErrors, setFormErrors] = useState({
    studentId: "",
    batchId: "",
    instId: "",
    paid: "",
    mode: "",
  });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (
      !formData.paid ||
      !formData.instId ||
      !formData.studentId ||
      !formData.batchId ||
      !formData.mode ||
      !amt === undefined
    ) {
      // Show error message if validation fails
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill out all required fields.",
      });
      return; // Stop the function from proceeding if validation fails
    }

    try {
      const paidAmount = parseInt(formData.paid, 10);
      const amtAmount = parseInt(amt, 10);

      const postData = {
        paid: formData.paid,
        instId: formData.instId,
        studentId: formData.studentId,
        batchId: formData.batchId,
        mode: formData.mode,
        tpaid: paidAmount + amtAmount,
        rid: Math.floor(Math.random() * 100000), // Generate a random number between 0 and 99999
      };

      await axios.post(api + "/newskill/savePaid", postData);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Form submitted successfully.",
      });

      setFormData({ studentId: "", batchId: "", instId: "", paid: "", mode: "" });
      getPaymentHistory();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "There was an error submitting the form.",
      });
      console.error("Error submitting form:", error);
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

  const getpaidInstallment = async () => {
    try {
      const res = await axios.get(
        `${api}/newskill/total-paid?studentId=${formData.studentId}&instId=${formData.instId}`
      );
      // Check if the response status code is in the 2xx range
      if (res.status >= 200 && res.status < 300) {
        setAmt(res.data);
      } else {
        setAmt(0);
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
      setAmt(0); // Optional: You might want to set an error state here
    }
  };

  const getPaymentHistory = async () => {
    try {
      const res = await axios.get(api + "/newskill/getAllPaidHistory");
      console.log("Fetched payment history:", res.data.installments);

      // Map through the installments to set `instId` based on a condition
      const formattedData = res.data.installments.map((inst) => {
        // Define `a` based on condition
        let a = "";
        if (inst.instId === 1) {
          a = "installment 1st";
        } else if (inst.instId === 2) {
          a = "installment 2nd";
        } else if (inst.instId === 3) {
          a = "installment 3rd";
        }

        return {
          id: inst.id,
          studentId: inst.studentId || "N/A",
          studentName: inst.studentName || "N/A",
          batchId: inst.batchName,
          instId: a,
          paid: inst.paid,
          rid: inst.rid,
        };
      });

      setData(formattedData);
    } catch (err) {
      console.error("Error fetching payment history:", err);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await axios.get(api + "/newskill/allBatches");
      console.log("Fetched batch data:", res.data);

      // Access batch data from the 'students' field in response
      const batchData = res.data.students || [];

      const formattedData = batchData.map((batch) => ({
        id: batch.batchId,
        name: batch.batchName,
      }));

      setBatches(formattedData);
    } catch (err) {
      console.error("Error fetching batch data:", err);
    }
  };

  const handleToggledownloadModal = (rid, iid, id, batchId) => {
    const rowData = data.find(
      (row) => row.id === rid && row.id === iid && row.id === id && row.batchId === batchId
    );
    navigate(`/invoice/${rid}/${iid}/${id}/${batchId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchBatches(), getOnlineTestDataApi(), getPaymentHistory()]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { sortable: false, field:  "id", headerName: "ID", width: 70 },
    { sortable: false, field:  "studentId", headerName: "S-Id ", width: 0 },
    { sortable: false, field:  "studentName", headerName: "Student Name ", width: 200 },
    { sortable: false, field:  "batchId", headerName: "Batch ", width: 200 },
    { sortable: false, field:  "instId", headerName: "Installment", width: 150 },
    { sortable: false, field:  "paid", headerName: "Paid Amount", width: 150 },
    { sortable: false, field:  "rid", headerName: "Receipt Id", width: 150 },
   {
      sortable: false,
      field: "actions",
      headerName: "Actions",
      width: 350,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            color="success"
            onClick={() =>
              handleToggledownloadModal(
                params.row.rid,
                params.row.id,
                params.row.studentId,
                params.row.batchId
              )
            }
            style={{ marginRight: 8 }}
          >
            View Reciept
          </Button>
          {/* <Button variant="contained" color="error" onClick={() => handleDelete(params.row.id)}>
            Delete
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Container maxWidth="sm">
          <Box sx={{ mt: 4 }}>
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
                  <FormLabel component="legend">Select Student</FormLabel>
                  <Select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    error={Boolean(formErrors.studentId)}
                    displayEmpty
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
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                  <FormLabel component="legend">Select Batch</FormLabel>

                  <Select
                    name="batchId"
                    value={formData.batchId}
                    onChange={handleChange}
                    error={Boolean(formErrors.batchId)}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      Select Batch
                    </MenuItem>
                    {batches.map((batch) => (
                      <MenuItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                  <FormLabel component="legend">Select Installment</FormLabel>
                  <Select
                    name="instId"
                    value={formData.instId}
                    onChange={handleChange}
                    error={Boolean(formErrors.instId)}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      Select Installment
                    </MenuItem>
                    <MenuItem value="1">Installment 1st</MenuItem>
                    <MenuItem value="2">Installment 2nd</MenuItem>
                    <MenuItem value="3">Installment 3rd</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  type="button"
                  variant="contained"
                  color="warning"
                  sx={{ minWidth: 100 }}
                  onClick={() => {
                    getpaidInstallment();
                  }}
                >
                  Check
                </Button>
                <Box sx={{ width: "100%", my: 2 }} />
                <FormControl sx={{ minWidth: 100 }}>
                  <FormLabel component="legend">Allready Paid installment </FormLabel>
                  <TextField
                    name="amt"
                    value={amt}
                    fullWidth
                    required
                    InputProps={{
                      readOnly: true, // Set the field to read-only
                    }}
                  />
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                  <FormLabel component="legend">Enter Paying Amount</FormLabel>
                  <TextField
                    label="Amount"
                    type="number"
                    name="paid"
                    value={formData.paid}
                    onChange={handleChange}
                    error={Boolean(formErrors.paid)}
                    helperText={formErrors.paid}
                    fullWidth
                  />
                </FormControl>
                <FormControl sx={{ minWidth: 200 }}>
                  <FormLabel component="legend">Payment Mode</FormLabel>
                  <TextField
                    label="Cash / Online"
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    error={Boolean(formErrors.mode)}
                    helperText={formErrors.mode}
                    fullWidth
                  />
                </FormControl>
                <Button type="submit" variant="contained" color="success" sx={{ minWidth: 100 }}>
                  Submit
                </Button>
              </Box>
            </form>
          </Box>
        </Container>
        <Divider />
        <Box sx={{ marginBottom: "42px" }}>
          <div style={{ height: 400, width: "100%" }}>
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
                pageSize={5}
                rowsPerPageOptions={[5, 10, 25]}
                pagination
                getRowId={(row) => row.id}
              />
            )}
          </div>
        </Box>
      </MDBox>
    </DashboardLayout>
  );
}

export default Payment;
