import { Button, Card, CircularProgress, Grid, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "layouts/authentication/components/Footer";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is imported
import { api } from "../../Api";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import MDBox from "components/MDBox";
import { ThumbUp } from "@mui/icons-material";

function DeactivateUser() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterdata, setFilterData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  useEffect(() => {
    fetchData();
  }, []);
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

  function exportToExcel(data, fileName = "data.xlsx") {
    const headerMap = {
      name: "Name",
      email: "Email Id",
      mobNo: "Mobile Number",
      role: "Role",
      gender: "Gender",
      dob: "Date of Birth",
      address: "Address",
      createdDate: "Created Date",
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
    exportToExcel(data, "Deactivate_Users.xlsx");
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
          entry?.gender.toLowerCase().includes(search.toLowerCase()) ||
          entry?.dob.toLowerCase().includes(search.toLowerCase()) ||
          entry?.role.toLowerCase().includes(search.toLowerCase())
      );

      setData(filterdatalist);
    }
  };
  const handleActivate = async (id, role) => {
    if (role == "TUTOR") {
      try {
        await axios.put(api + `/newskill/deactivateTutor?tutorId=${id}`);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Tutor Activated  Successfully.",
        });
        const updatedData = data.filter((row) => row.id !== id);
        fetchData();
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
          text: "User Activated  Successfully.",
        });
        const updatedData = data.filter((row) => row.id !== id);
        fetchData();
        setData(updatedData);
      } catch (error) {
        console.error("Error deleting test:", error);
      }
    }
  };

  const getOnlineTestDataApi = async () => {
    try {
      const res = await axios.get(api + "/newskill/getbyStatus");
      console.log("Fetched data:", res.data);

      const formattedData = res.data.map((student, index) => ({
        id: student.userId || `temp-id-${index}`, // Fallback id if userId is missing
        name: student.name,
        email: student.email,
        mobNo: student.mobNo,
        designation: student.designation || student.batchname,
        role: student.role,
        createdDate: student.createdDate,
        gender: student.gender || "N/A",
        dob: student.dob ? new Date(student.dob).toLocaleDateString("en-US") : "N/A",
        address: student.address || "N/A",
        enabled: student.enabled,
      }));

      return formattedData;
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
    }
  };

  const columns = [
    { sortable: false, field: "name", headerName: "Name", width: 230 },
    { sortable: false, field: "email", headerName: "Email", width: 250 },
    { sortable: false, field: "dob", headerName: "DOB", width: 100 },
    { sortable: false, field: "gender", headerName: "Gender", width: 100 },
    { sortable: false, field: "mobNo", headerName: "Mobile", width: 110 },
    { sortable: false, field: "address", headerName: "Address", width: 200 },
    { sortable: false, field: "role", headerName: "Role", width: 100 },
    {
      sortable: false,
      field: "actions",
      headerName: "Actions",
      width: 80,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          color="info"
          size="small"
          title="Activate User"
          onClick={() => handleActivate(params.row.id, params.row.role)}
        >
          <ThumbUp />
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

export default DeactivateUser;
