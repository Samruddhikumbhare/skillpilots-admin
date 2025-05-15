import { Button, Card, CircularProgress, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "layouts/authentication/components/Footer";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is imported
import { api } from "../../Api";
import * as XLSX from "xlsx";
import MDBox from "components/MDBox";
function TraineeTutList() {
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
      email: "Email",
      batchName: "Batch Name",
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
    exportToExcel(data, "Trainee_TutorList.xlsx");
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
          entry?.batchName.toLowerCase().includes(search.toLowerCase())
      );

      setData(filterdatalist);
    }
  };
  const getOnlineTestDataApi = async () => {
    try {
      const res = await axios.get(api + "/newskill/getAllTutor");
      console.log("Fetched data:", res.data.tutors);

      const formattedData = res.data.tutors.map((tut) => ({
        id: tut.tutorId,
        name: tut.name || "N/A", // Provide a default value if name is null
        email: tut.email,
        batchName: tut.batches.length > 0 ? tut.batches[0].batchName : "N/A", // Get the first batch name or "N/A" if none
      }));

      return formattedData;
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
    }
  };

  const columns = [
    // { sortable: false, field:  "id", headerName: "ID", width: 70 },
    { sortable: false, field: "name", headerName: "Name", width: 250 },
    { sortable: false, field: "email", headerName: "Email", width: 250 },
    { sortable: false, field: "batchName", headerName: "Batch Name", width: 200 },
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

export default TraineeTutList;
