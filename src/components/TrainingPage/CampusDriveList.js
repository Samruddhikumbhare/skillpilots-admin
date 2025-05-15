import { CircularProgress, Button, Grid, Card } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "layouts/authentication/components/Footer";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../Api";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
function CampusDriveList() {
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

  const handleChange = (search) => {
    if (search == "") {
      setData(filterdata);
    } else {
      const filterdatalist = data.filter(
        (entry) =>
          entry?.name.toLowerCase().includes(search.toLowerCase()) ||
          entry?.cutoff.toString().toLowerCase().includes(search.toLowerCase()) ||
          entry?.marks.toString().toLowerCase().includes(search.toLowerCase()) ||
          entry?.status.toString().toLowerCase().includes(search.toLowerCase())
      );

      setData(filterdatalist);
    }
  };
  const getOnlineTestDataApi = async () => {
    try {
      const res = await axios.get(api + "/newskill/passedStudents");
      console.log("Fetched data:", res.data);

      // Check if the response has data and map it correctly
      if (res.data && res.data.data) {
        const formattedData = res.data.data.map((student, index) => ({
          id: index + 1, // Assigning an id based on the index
          name: student[0], // Name
          status: student[1], // Status (Pass/Fail)
          marks: student[2], // Marks
          cutoff: student[3] || 20, // Cutoff
        }));

        return formattedData;
      } else {
        return []; // Return empty if no data
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
    }
  };

  function exportToExcel(data, fileName = "data.xlsx") {
    const headerMap = {
      id: "Sr. No",
      name: "Name",
      cutoff: "Cut Off",
      marks: "Marks",
      status: "Status",
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
    exportToExcel(data, "Recruitment.xlsx");
  };
  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };
  const columns = [
    { sortable: false, field: "id", headerName: "ID", width: 100 },
    { sortable: false, field: "name", headerName: "Name", width: 250 },
    { sortable: false, field: "cutoff", headerName: "Cut Off", width: 100 },
    { sortable: false, field: "marks", headerName: "Score", width: 100 },
    { sortable: false, field: "status", headerName: "Status", width: 100 },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar onDataSend={handleChange} />
      <MDBox pt={3} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card sx={{ p: 1, pt: 2 }}>
              <div style={{ width: "100%" }}>
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
                  <>
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
                      getRowId={(row) => row.id} // Using id as the row ID
                      paginationModel={paginationModel} // Make sure this is initialized correctly
                      pageSize={paginationModel.pageSize}
                      onPaginationModelChange={handlePaginationChange} // Handle both page and page size changes
                    />
                  </>
                )}
              </div>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default CampusDriveList;
