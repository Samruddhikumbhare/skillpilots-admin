import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";
import { api } from "../../Api";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Box, Button, Card, CircularProgress, Grid, Tab, Tabs } from "@mui/material";
import { Modal } from "@mui/material";
import MDBox from "components/MDBox";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
const style = {
  DetailsBoxMain: {
    display: "flex",
    paddingBottom: "15px",
  },
  DetailsBoxChild: {
    width: "50%",
  },
  headingTitle: {
    fontFamily: "emoji",
    fontWeight: "600",
    fontSize: "16px",
  },
  SubTitle: {
    fontFamily: "emoji",
    fontWeight: "400",
    fontSize: "16px",
    color: "gray",
  },
};

function AllAdvertismentList() {
  const [activeTab, setActiveTab] = useState(0);
  const [adv, setAdv] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [companyAdv, setCompanyAdv] = useState([]);
  const [filterCompanyData, setFilterCompanyData] = useState([]);

  const [collegeAdv, setCollegeAdv] = useState([]);
  const [filterCollegeData, setFilterCollegeData] = useState([]);

  const [searchString, setsearchString] = useState("");
  const [searchStringCollege, setsearchStringCollege] = useState("");
  const [searchStringCompany, setsearchStringCompany] = useState("");

  const [loader, setLoader] = useState(false);
  const [selectedData, setSelectedData] = useState({}); // Store API response data here
  const [open, setOpen] = useState(false);

  const [selectedDataCollege, setSelectedDataCollege] = useState({}); // Store API response data here
  const [openCollege, setOpenCollege] = useState(false);

  const [selectedDataCompany, setSelectedDataCompany] = useState({}); // Store API response data here
  const [openCompany, setOpenCompany] = useState(false);

  const [filterDataTab, setFilterDataTab] = useState([]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });

  const getStd = async () => {
    setLoader(true);
    try {
      const token = localStorage.getItem("skillpilotAdminToken"); // Adjust the key name as needed
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      };
      const res = await axios.get(api + "/newskill/api/advertisement", config);
      let aa = res.data.advertisement.map((val, index) => {
        return { ...val, id: index + 1 };
      });
      setAdv(aa); // Update the state with the received advertisement data
      setFilterData(aa);
      filterDataByTab(aa, 0);

      const resCollege = await axios.get(api + "/newskill/all", config);
      let clg = resCollege.data.data.map((val, index) => {
        return { ...val, id: index + 1 };
      });
      setCollegeAdv(clg); // Update the state with the received advertisement data
      setFilterCollegeData(clg);

      const resCompany = await axios.get(api + "/newskill/getCompanyDrive", config);
      let com = resCompany.data.map((val, index) => {
        return { ...val, id: index + 1 };
      });
      setCompanyAdv(com); // Update the state with the received advertisement data
      setFilterCompanyData(com);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Error fetching advertisements: ", error);
    }
  };

  useEffect(() => {
    getStd();
  }, []); // Fetch data on component mount

  const handleChange = (data) => {
    setsearchString(data);
    console.log("data", data);
    if (data == "") {
      setAdv(filterData);
    } else {
      const filterdatalist = adv.filter(
        (item) =>
          item?.companyName.toLowerCase().includes(data.toLowerCase()) ||
          item?.adv_title.toLowerCase().includes(data.toLowerCase()) ||
          item?.location.toLowerCase().includes(data.toLowerCase()) ||
          item?.status.toLowerCase().includes(data.toLowerCase())
      );
      console.log(filterdatalist);
      setAdv(filterdatalist);
    }
  };
  const handleClose = () => setOpen(false);
  const viewData = (item) => {
    setOpen(true);
    setSelectedData(item.row);
  };
  const columns = [
    { sortable: false, field: "id", headerName: "ID", width: 50 },
    { sortable: false, field: "companyName", headerName: "Company Name", width: 230 },
    { sortable: false, field: "technology", headerName: "Technology", width: 150 },
    { sortable: false, field: "start_date", headerName: "Start Date", width: 100 },
    {
      sortable: false,
      field: "expiration_date",
      headerName: "Expiration Date",
      width: 120,
      valueFormatter: (params) => {
        // Improved error handling
        if (params && params.value) {
          return params.value;
        }
        return "N/A"; // Handle null or undefined values
      },
    },
    { sortable: false, field: "status", headerName: "Status", width: 100 },
    { sortable: false, field: "adv_title", headerName: "Advertisement Title", width: 200 },
    { sortable: false, field: "location", headerName: "Location", width: 120 },
    {
      sortable: false,
      field: "details",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <Button
          data-toggle="tooltip"
          title="Show Details"
          variant="contained"
          size="small"
          style={{ background: "#3791ee", color: "white" }}
          color=""
          onClick={() => viewData(params)} // Pass the selected email to fetch company details
        >
          <i className="fa fa-info-circle" style={{ fontSize: "17px" }} aria-hidden="true"></i>

          {/* Show Details */}
        </Button>
      ),
    },
  ];

  function exportToExcel(adv, fileName = "data.xlsx") {
    const headerMap = {
      adv_title: "Name",
      companyName: "Company Name",
      requirement: "Requirement",
      technology: "Technology",
      stipend: "Stipend",
      location: "Location",
      status: "Status",
      start_date: "Start Date",
      description: "Description", // Fixed typo
    };

    // Extract headers
    const headers = Object.values(headerMap);

    // Map data to match header order
    const data = adv.map((item) => Object.keys(headerMap).map((key) => item[key] || ""));

    // Combine headers and data
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
  }

  const handleDownload = () => {
    exportToExcel(adv, "Advertisement.xlsx");
  };

  const handleChangeCollege = (data) => {
    setsearchStringCollege(data);
    console.log("data", data);
    if (data == "") {
      setCollegeAdv(filterCollegeData);
    } else {
      const filterdatalist = collegeAdv.filter(
        (item) =>
          item?.companyName.toLowerCase().includes(data.toLowerCase()) ||
          item?.profile.toLowerCase().includes(data.toLowerCase())
      );
      console.log(filterdatalist);
      setCollegeAdv(filterdatalist);
    }
  };
  const handleCloseCollege = () => setOpenCollege(false);
  const viewDataCollege = (item) => {
    setOpenCollege(true);
    setSelectedDataCollege(item.row);
  };
  const columnsCollege = [
    { sortable: false, field: "id", headerName: "ID", width: 50 },
    { sortable: false, field: "companyName", headerName: "Company Name", width: 220 },
    { sortable: false, field: "contactNo", headerName: "Company Contact", width: 150 },
    { sortable: false, field: "email", headerName: "Company Email", width: 150 },

    { sortable: false, field: "address", headerName: "Address", width: 150 },
    { sortable: false, field: "profile", headerName: "Job Title", width: 150 },
    { sortable: false, field: "ctc", headerName: "CTC Offer", width: 100 },

    { sortable: false, field: "status", headerName: "Status", width: 100 },
    {
      sortable: false,
      field: "details",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <Button
          data-toggle="tooltip"
          title="Show Details"
          variant="contained"
          size="small"
          style={{ background: "#3791ee", color: "white" }}
          color=""
          onClick={() => viewDataCollege(params)} // Pass the selected email to fetch company details
        >
          <i className="fa fa-info-circle" style={{ fontSize: "17px" }} aria-hidden="true"></i>

          {/* Show Details */}
        </Button>
      ),
    },
  ];

  function exportToExcelCollege(collegeAdv, fileName = "data.xlsx") {
    const headerMap = {
      companyName: "Company Name",
      contactNo: "Company Contact",
      email: "Company Email",
      address: "Address",
      profile: "Job Title",
      ctc: "CTC Offer",
      status: "Status", // Fixed typo
    };

    // Extract headers
    const headers = Object.values(headerMap);

    // Map data to match header order
    const data = collegeAdv.map((item) => Object.keys(headerMap).map((key) => item[key] || ""));

    // Combine headers and data
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
  }

  const handleDownloadCollege = () => {
    exportToExcelCollege(collegeAdv, "CollegeAdvertisement.xlsx");
  };

  const handleChangeCompany = (data) => {
    setsearchStringCompany(data);
    if (data == "") {
      setCompanyAdv(filterCompanyData);
    } else {
      const filterdatalist = collegeAdv.filter(
        (item) =>
          item?.companyName?.toLowerCase().includes(data.toLowerCase()) ||
          item?.skill?.toLowerCase().includes(data.toLowerCase()) ||
          item?.jobRole?.toLowerCase().includes(data.toLowerCase())
      );
      setCompanyAdv(filterdatalist);
    }
  };
  const handleCloseCompany = () => setOpenCompany(false);
  const viewDataCompany = (item) => {
    setOpenCompany(true);
    setSelectedDataCompany(item.row);
  };
  const columnsCompany = [
    { sortable: false, field: "id", headerName: "ID", width: 50 },
    { sortable: false, field: "companyName", headerName: "Company Name", width: 200 },
    { sortable: false, field: "skill", headerName: "Skill", width: 150 },
    { sortable: false, field: "jobRole", headerName: "Job Role", width: 150 },
    { sortable: false, field: "interviewDate", headerName: "Interview Date", width: 120 },
    { sortable: false, field: "experience", headerName: "Experience", width: 150 },
    { sortable: false, field: "ctc", headerName: "Offer CTC", width: 90 },

    { sortable: false, field: "status", headerName: "Status", width: 70 },
    { sortable: false, field: "location", headerName: "Location", width: 100 },
    {
      sortable: false,
      field: "details",
      headerName: "Action",
      width: 80,
      renderCell: (params) => (
        <Button
          data-toggle="tooltip"
          title="Show Details"
          size="small"
          variant="contained"
          style={{ background: "#3791ee", color: "white" }}
          color=""
          onClick={() => viewDataCompany(params)} // Pass the selected email to fetch company details
        >
          <i className="fa fa-info-circle" style={{ fontSize: "17px" }} aria-hidden="true"></i>

          {/* Show Details */}
        </Button>
      ),
    },
  ];

  function exportToExcelCompany(companyAdv, fileName = "data.xlsx") {
    const headerMap = {
      companyName: "Company Name",
      skill: "Skill",
      jobRole: "Job Role",
      jobDescription: "Job Descripition",
      interviewDate: "Interview Date",
      ctc: "Experience",
      experience: "Minimum UG %",
      status: "Status",
      location: "Location",
    };

    // Extract headers
    const headers = Object.values(headerMap);

    // Map data to match header order
    const data = companyAdv.map((item) => Object.keys(headerMap).map((key) => item[key] || ""));

    // Combine headers and data
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
  }

  const handleDownloadCompany = () => {
    exportToExcelCompany(companyAdv, "CompanyAdvertisement.xlsx");
  };

  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  const handleTabChange = (event, newTab) => {
    setActiveTab(newTab);
    filterDataByTab(adv, newTab);
  };

  const filterDataByTab = (data, tabIndex) => {
    let filtered = [];
    if (tabIndex === 0) {
      filtered = data.filter((item) => item.category === "Internship");
    } else if (tabIndex === 1) {
      filtered = data.filter((item) => item.category === "College Placement");
    } else {
      filtered = data.filter((item) => item.category === "Company Placement");
    }
    setFilterDataTab(filtered);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar
        onDataSend={
          activeTab === 0
            ? handleChange
            : activeTab === 1
            ? handleChangeCollege
            : handleChangeCompany
        }
      />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card sx={{ p: 1, pt: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Internship" />
                  <Tab label="College Placement" />
                  <Tab label="Company Placement" />
                </Tabs>
              </Box>

              {activeTab === 0 && (
                <MDBox pt={3} pb={3}>
                  <div
                    style={{
                      paddingBottom: "10px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
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
                  <Grid container spacing={6}>
                    <Grid item xs={12}>
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
                      ) : adv.length > 0 ? (
                        <div style={{ width: "100%" }}>
                          <DataGrid
                            rows={adv} // Use adv for rows
                            columns={columns}
                            getRowId={(row) => row.id} // Use id as the unique key for rows
                            rowsPerPageOptions={[5, 10, 25]}
                            pagination
                            disableColumnMenu
                            sx={{
                              "& .MuiDataGrid-columnSeparator": {
                                display: "none !important", // Hide the column resize handles
                              },
                            }}
                            paginationModel={paginationModel} // Make sure this is initialized correctly
                            pageSize={paginationModel.pageSize}
                            onPaginationModelChange={handlePaginationChange} // Handle both page and page size changes
                          />
                        </div>
                      ) : (
                        <div>No advertisements found</div> // Adjust message accordingly
                      )}

                      <Modal open={open} onClose={handleClose}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 800,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                          }}
                        >
                          <div>
                            <div>
                              <div
                                style={{
                                  paddingBottom: "8px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <h4>Advertisement Details</h4>
                                <span>
                                  <i
                                    className="fa fa-times"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      handleClose();
                                    }}
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </div>
                              <hr />
                              <br />
                              <div>
                                <div style={style.DetailsBoxMain}>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Name : </label>
                                    <span style={style.SubTitle}>{selectedData?.adv_title}</span>
                                  </div>

                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>company : </label>
                                    <span style={style.SubTitle}>{selectedData?.companyName}</span>
                                  </div>
                                </div>

                                <div style={style.DetailsBoxMain}>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Requirement : </label>
                                    <span style={style.SubTitle}>{selectedData?.requirement}</span>
                                  </div>

                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Technology : </label>
                                    <span style={style.SubTitle}>{selectedData?.technology}</span>
                                  </div>
                                </div>

                                <div style={style.DetailsBoxMain}>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Stipend : </label>
                                    <span style={style.SubTitle}>{selectedData?.stipend}</span>
                                  </div>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Location : </label>
                                    <span style={style.SubTitle}>{selectedData?.location}</span>
                                  </div>
                                </div>
                                <div style={style.DetailsBoxMain}>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Status : </label>
                                    <span style={style.SubTitle}>{selectedData?.status}</span>
                                  </div>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Description : </label>
                                    <span style={style.SubTitle}>{selectedData?.description}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Box>
                      </Modal>
                    </Grid>
                  </Grid>
                </MDBox>
              )}

              {activeTab === 1 && (
                <MDBox pt={3} pb={3}>
                  <div
                    style={{
                      paddingBottom: "10px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      variant="contained"
                      color=""
                      style={{ backgroundColor: "#78b7f2", color: "white" }}
                      onClick={handleDownloadCollege}
                    >
                      Download Excel
                    </Button>
                  </div>
                  <Grid container spacing={6}>
                    <Grid item xs={12}>
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
                      ) : collegeAdv.length > 0 ? (
                        <div style={{ width: "100%" }}>
                          <DataGrid
                            rows={collegeAdv} // Use adv for rows
                            columns={columnsCollege}
                            getRowId={(row) => row.id} // Use id as the unique key for rows
                            rowsPerPageOptions={[5, 10, 25]}
                            pagination
                            disableColumnMenu
                            sx={{
                              "& .MuiDataGrid-columnSeparator": {
                                display: "none !important", // Hide the column resize handles
                              },
                            }}
                            paginationModel={paginationModel} // Make sure this is initialized correctly
                            pageSize={paginationModel.pageSize}
                            onPaginationModelChange={handlePaginationChange} // Handle both page and page size changes
                          />
                        </div>
                      ) : (
                        <div>No advertisements found</div> // Adjust message accordingly
                      )}

                      <Modal open={openCollege} onClose={handleCloseCollege}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 800,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                          }}
                        >
                          <div>
                            <div>
                              <div
                                style={{
                                  paddingBottom: "8px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <h4>College Advertisement Details</h4>
                                <span>
                                  <i
                                    className="fa fa-times"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      handleCloseCollege();
                                    }}
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </div>
                              <hr />
                              <br />
                              <div>
                                <div style={style.DetailsBoxMain}>
                                  <div style={style.DetailsBoxChildD}>
                                    <label style={style.headingTitle}>Company Name : </label>
                                    <span style={style.SubTitle}>
                                      {selectedDataCollege?.companyName}
                                    </span>
                                  </div>
                                </div>
                                <div style={style.DetailsBoxMain}>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Company Contact : </label>
                                    <span style={style.SubTitle}>
                                      {selectedDataCollege?.contactNo}
                                    </span>
                                  </div>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Company Email : </label>
                                    <span style={style.SubTitle}>{selectedDataCollege?.email}</span>
                                  </div>
                                </div>{" "}
                                <div style={style.DetailsBoxMain}>
                                  <div style={style.DetailsBoxChildD}>
                                    <label style={style.headingTitle}>Address : </label>
                                    <span style={style.SubTitle}>
                                      {selectedDataCollege?.address}
                                    </span>
                                  </div>
                                </div>
                                <div style={style.DetailsBoxMain}>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Job Title : </label>
                                    <span style={style.SubTitle}>
                                      {selectedDataCollege?.profile}
                                    </span>
                                  </div>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>CTC Offer : </label>
                                    <span style={style.SubTitle}>{selectedDataCollege?.ctc}</span>
                                  </div>
                                </div>
                                <div style={style.DetailsBoxMain}>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Status : </label>
                                    <span style={style.SubTitle}>
                                      {selectedDataCollege?.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Box>
                      </Modal>
                    </Grid>
                  </Grid>
                </MDBox>
              )}

              {activeTab === 2 && (
                <MDBox pt={3} pb={3}>
                  <div
                    style={{
                      paddingBottom: "10px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      variant="contained"
                      color=""
                      style={{ backgroundColor: "#78b7f2", color: "white" }}
                      onClick={handleDownloadCompany}
                    >
                      Download Excel
                    </Button>
                  </div>
                  <Grid container spacing={6}>
                    <Grid item xs={12}>
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
                      ) : companyAdv.length > 0 ? (
                        <div style={{ width: "100%" }}>
                          <DataGrid
                            rows={companyAdv} // Use adv for rows
                            columns={columnsCompany}
                            getRowId={(row) => row.id} // Use id as the unique key for rows
                            rowsPerPageOptions={[5, 10, 25]}
                            pagination
                            disableColumnMenu
                            sx={{
                              "& .MuiDataGrid-columnSeparator": {
                                display: "none !important", // Hide the column resize handles
                              },
                            }}
                            paginationModel={paginationModel} // Make sure this is initialized correctly
                            pageSize={paginationModel.pageSize}
                            onPaginationModelChange={handlePaginationChange} // Handle both page and page size changes
                          />
                        </div>
                      ) : (
                        <div>No advertisements found</div> // Adjust message accordingly
                      )}

                      <Modal open={openCompany} onClose={handleCloseCompany}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 800,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                          }}
                        >
                          <div>
                            <div>
                              <div
                                style={{
                                  paddingBottom: "8px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <h4>Company Advertisement Details</h4>
                                <span>
                                  <i
                                    className="fa fa-times"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      handleCloseCompany();
                                    }}
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </div>
                              <hr />
                              <br />
                              <div>
                                <div style={style.DetailsBoxMain}>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Company Name : </label>
                                    <span style={style.SubTitle}>
                                      {selectedDataCompany?.companyName}
                                    </span>
                                  </div>

                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Skill : </label>
                                    <span style={style.SubTitle}>{selectedDataCompany?.skill}</span>
                                  </div>
                                </div>

                                <div style={style.DetailsBoxMain}>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Job Role : </label>
                                    <span style={style.SubTitle}>
                                      {selectedDataCompany?.jobRole}
                                    </span>
                                  </div>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Location : </label>
                                    <span style={style.SubTitle}>
                                      {selectedDataCompany?.location}
                                    </span>
                                  </div>
                                </div>

                                <div style={style.DetailsBoxMain}>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Interview Date : </label>
                                    <span style={style.SubTitle}>
                                      {selectedDataCompany?.interviewDate}
                                    </span>
                                  </div>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>CTC Offer : </label>
                                    <span style={style.SubTitle}>{selectedDataCompany?.ctc}</span>
                                  </div>
                                </div>
                                <div style={style.DetailsBoxMain}>
                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Experience : </label>
                                    <span style={style.SubTitle}>
                                      {selectedDataCompany?.experience}
                                    </span>
                                  </div>

                                  <div style={style.DetailsBoxChild}>
                                    <label style={style.headingTitle}>Status : </label>
                                    <span style={style.SubTitle}>
                                      {selectedDataCompany?.status}
                                    </span>
                                  </div>
                                </div>
                                <div style={style.DetailsBoxChildD}>
                                  <label style={style.headingTitle}>Job Descripition : </label>
                                  <span style={style.SubTitle}>
                                    {selectedDataCompany?.jobDescription}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Box>
                      </Modal>
                    </Grid>
                  </Grid>
                </MDBox>
              )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AllAdvertismentList;
