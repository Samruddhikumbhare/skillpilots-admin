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
  Grid,
  Card,
  InputLabel,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import axios from "axios";
import { api } from "../../Api";
import Swal from "sweetalert2";

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
function AssignBatch() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({ studentId: "", batchId: "", batchfees: "" });
  const [formErrors, setFormErrors] = useState({ studentId: "", batchId: "", batchfees: "" });
  const [loading, setLoading] = useState(true);
  const [disableButton, setDisableButton] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    if (formData.studentId == "" || formData.batchId == "" || formData.batchfees == "") {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [formData]); // Only re-run effect if searchTerm changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${api}/newskill/batch-to-student?studentId=${formData.studentId}&batchId=${formData.batchId}&batchfees=${formData.batchfees}`
      );
      Swal.fire({ icon: "success", title: "Success!", text: "Form submitted successfully." });
      setFormData({ studentId: "", batchId: "", batchfees: "" });
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
      const studentsData = res.data.students || [];
      setStudents(studentsData);
    } catch (err) {
      console.error("Error fetching student data:", err);
    }
  };
  const fetchBatches = async () => {
    try {
      const res = await axios.get(api + "/newskill/allBatches");
      console.log("Fetched batch data:", res.data);

      // Assuming res.data is an array of batches
      const formattedData = res.data.students.map((batch) => ({
        id: batch.batchId,
        name: batch.batchName,
        batchfees: batch.batchfees,
      }));

      setBatches(formattedData);
    } catch (err) {
      console.error("Error fetching batch data:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchBatches(), getOnlineTestDataApi()]);
      } catch (error) {
        console.error("Error during data fetching:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress color="info" />;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Select Student</InputLabel>
                    <Select
                      label="Select Student"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      error={Boolean(formErrors.studentId)}
                      fullWidth
                      sx={{ padding: "12px !important" }}
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
                    <InputLabel>Select Batch</InputLabel>
                    <Select
                      label="Select Batch"
                      name="batchId"
                      value={formData.batchId}
                      onChange={handleChange}
                      error={Boolean(formErrors.batchId)}
                      fullWidth
                      sx={{ padding: "12px !important" }}
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
                    <InputLabel>Select Fees</InputLabel>
                    <Select
                      label="Select Fees"
                      name="batchfees"
                      value={formData.batchfees}
                      onChange={handleChange}
                      error={Boolean(formErrors.batchfees)}
                      fullWidth
                      sx={{ padding: "12px !important" }}
                    >
                      <MenuItem value="" disabled>
                        Select Fees
                      </MenuItem>
                      <MenuItem value="20000">20000</MenuItem>
                      <MenuItem value="25000">25000</MenuItem>
                    </Select>
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
    </DashboardLayout>
  );
}

export default AssignBatch;
