import { Button, Card, CircularProgress, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "layouts/authentication/components/Footer";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is imported
import { api } from "../../Api";
import * as XLSX from "xlsx";
import { filter } from "lodash";
import MDBox from "components/MDBox";

function TraineeList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterdata, setFilterData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedData = await getOnlineTestDataApi();
        setData(formattedData);
        setFilterData(formattedData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  function exportToExcel(data, fileName = "data.xlsx") {
    const headerMap = {
      name: "Name",
      email: "Email Id",
      address: "Address",
      designation: "Batch",
      fees: "Fees",
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
  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };
  const handleDownload = () => {
    exportToExcel(data, "Traineelist.xlsx");
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
          entry?.role.toLowerCase().includes(search.toLowerCase()) ||
          entry?.dob.toLowerCase().includes(search.toLowerCase())
      );

      setData(filterdatalist);
    }
  };

  const getOnlineTestDataApi = async () => {
    try {
      const res = await axios.get(api + "/newskill/traineeStudents");
      console.log("Fetched data:", res.data);

      const formattedData = res.data.map((student) => ({
        id: student.name.userId,
        name: student.name.name,
        email: student.name.email,
        mobNo: student.name.mobNo,
        fees: student.name.batchfees,
        designation: student.name.designation || student.batchname,
        role: student.name.role,
        createdDate: student.name.createdDate,
        gender: student.name.gender || "N/A",
        dob: student.name.dob ? new Date(student.name.dob).toLocaleDateString("en-US") : "N/A",
        address: student.name.address || "N/A",
        enabled: student.name.enabled,
      }));

      return formattedData;
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
    }
  };

  const columns = [
    { sortable: false, field: "name", headerName: "Name", width: 180 },
    { sortable: false, field: "email", headerName: "Email", width: 240 },
    { sortable: false, field: "address", headerName: "Address", width: 150 },
    { sortable: false, field: "designation", headerName: "Batch", width: 150 },
    { sortable: false, field: "fees", headerName: "Fees", width: 70 },

    { sortable: false, field: "dob", headerName: "DOB", width: 100 },
    { sortable: false, field: "gender", headerName: "Gender", width: 70 },
    { sortable: false, field: "mobNo", headerName: "Mobile", width: 100 },
    { sortable: false, field: "role", headerName: "Role", width: 100 },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar onDataSend={handleChangesearch} />
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

export default TraineeList;
