import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Switch, Button, Modal, Box, CircularProgress } from "@mui/material";
import { api } from "../../Api";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
const handleToggle = async (id, newStatus, setData) => {
  try {
    // Show loading SweetAlert
    Swal.fire({
      title: "Updating Status",
      text: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Make the PUT request to update the status
    await axios.put(api + `/newskill/updateCompany?company_id=${id}`, {
      id,
      status: newStatus,
    });

    // Update the status in the local data state
    setData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, status: newStatus } : row))
    );

    // Close the SweetAlert loading indicator and show success message
    Swal.fire({
      icon: "success",
      title: "Status Updated",
      text: "The status has been successfully updated.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    // Close the SweetAlert loading indicator and show error message
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to update the status. Please try again later.",
    });
    console.error("Error updating status:", error);
  }
};

const getCompanyDataApi = async () => {
  try {
    const res = await axios.get(api + "/newskill/getAllComp");
    if (res.data && Array.isArray(res.data.companies)) {
      const formattedData = res.data.companies.map((row) => ({
        id: row[0],
        username: row[1],
        contact_no: row[2],
        college_id: row[4],
        email: row[5],
        creationDate: formatDate(row[6]),
        package_name: row[7],
        status: row[3] || false,
      }));
      return formattedData;
    } else {
      console.error("Unexpected data structure", res.data);
      return [];
    }
  } catch (err) {
    console.error("Error fetching company data:", err);
    throw err;
  }
};
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
const CompanyList = ({ searchString }) => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null); // Store API response data here
  const [loading, setLoading] = useState(false); // Track loading state
  const [filterdata, setFilterData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  const [loaderCompany, setCompanyLoader] = useState(false);
  // Handle page and page size change

  useEffect(() => {
    setCompanyLoader(true);
    getCompanyDataApi()
      .then((formattedData) => {
        setData(formattedData);
        setCompanyLoader(false);
        setFilterData(formattedData);
      })
      .catch((err) => {
        setCompanyLoader(false);
      });
  }, []);

  const handleCellClick = (params) => {
    handleOpen(params.row.email);
  };
  // Fetch company details by email
  const handleOpen = async (email) => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/newskill/companyInfo?email=${email}`);
      if (res.data && res.data.company) {
        setSelectedCompany(res.data.company); // Correctly store company data in the state
      } else {
        console.error("Company not found:", res.data);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    } finally {
      setLoading(false);
      setOpen(true); // Open the modal regardless of success or failure
    }
  };
  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (searchString == "") {
      setData(filterdata);
    } else {
      const filterdatalist = data.filter(
        (entry) =>
          entry?.username.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.email.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.package_name.toLowerCase().includes(searchString.toLowerCase())
      );

      setData(filterdatalist);
    }
  }, [searchString]);

  function exportToExcel(data, fileName = "data.xlsx") {
    const headerMap = {
      username: "Name",
      email: "Email Id",
      contact_no: "Contact Number",
      package_name: "Package Name",
      status: "Status",
      creationDate: "Date",
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
    exportToExcel(data, "company_list.xlsx");
  };
  const columns = [
    // { sortable: false, field:  "id", headerName: "ID", width: 100 },
    {
      sortable: false,
      field: "username",
      headerName: "Name",
      width: 300,
      renderCell: (params) => (
        <div
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => {
            handleCellClick(params);
          }}
        >
          {params.row.username}
        </div>
      ),
    },
    { sortable: false, field: "email", headerName: "Email", width: 230 },
    { sortable: false, field: "contact_no", headerName: "Contact", width: 100 },
    { sortable: false, field: "package_name", headerName: "Package Name", width: 200 },
    // { sortable: false, field:  "college_id", headerName: "College ID", width: 100 },
    { sortable: false, field: "creationDate", headerName: "Creation Date", width: 150 },
    {
      sortable: false,
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={(e) => handleToggle(params.row.id, e.target.checked, setData)}
        />
      ),
    },
    {
      sortable: false,
      field: "details",
      headerName: "Details",
      width: 100,
      renderCell: (params) => (
        <Button
          data-toggle="tooltip"
          title="Show Details"
          variant="contained"
          style={{ background: "#3791ee", color: "white" }}
          color=""
          onClick={() => handleOpen(params.row.email)} // Pass the selected email to fetch company details
        >
          <i className="fa fa-info-circle" style={{ fontSize: "17px" }} aria-hidden="true"></i>

          {/* Show Details */}
        </Button>
      ),
    },
  ];

  return (
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
      {loaderCompany ? (
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
        <div style={{ padding: "10px 15px", fontSize: "18px", fontWeight: "600" }}>Not found</div>
      )}

      {/* Modal to show details */}
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
          {loading ? (
            <p>Loading...</p>
          ) : selectedCompany ? (
            <div>
              <div>
                <div
                  style={{
                    paddingBottom: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <h4>Company Details</h4>
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
                      <span style={style.SubTitle}>{selectedCompany.company_name}</span>
                    </div>

                    <div style={style.DetailsBoxChild}>
                      <label style={style.headingTitle}>Registration No: : </label>
                      <span style={style.SubTitle}>{selectedCompany.registration_no}</span>
                    </div>
                  </div>

                  <div style={style.DetailsBoxMain}>
                    <div style={style.DetailsBoxChild}>
                      <label style={style.headingTitle}>Contact 1 : </label>
                      <span style={style.SubTitle}>{selectedCompany.contact_1}</span>
                    </div>

                    <div style={style.DetailsBoxChild}>
                      <label style={style.headingTitle}>Contact 2 : </label>
                      <span style={style.SubTitle}>{selectedCompany.contact_2}</span>
                    </div>
                  </div>

                  <div style={style.DetailsBoxMain}>
                    <div style={style.DetailsBoxChild}>
                      <label style={style.headingTitle}>City : </label>
                      <span style={style.SubTitle}>{selectedCompany.city}</span>
                    </div>
                    <div style={style.DetailsBoxChild}>
                      <label style={style.headingTitle}>State : </label>
                      <span style={style.SubTitle}>{selectedCompany.state}</span>
                    </div>
                  </div>

                  <div style={style.DetailsBoxMain}>
                    <div style={style.DetailsBoxChild}>
                      <label style={style.headingTitle}>Country : </label>
                      <span style={style.SubTitle}>{selectedCompany.country}</span>
                    </div>
                    <div style={style.DetailsBoxChild}>
                      <label style={style.headingTitle}>Pincode : </label>
                      <span style={style.SubTitle}>{selectedCompany.pincode}</span>
                    </div>
                  </div>

                  <div style={style.DetailsBoxMain}>
                    <div style={style.DetailsBoxChild}>
                      <label style={style.headingTitle}>Website : </label>
                      <span style={style.SubTitle}>{selectedCompany.web_url}</span>
                    </div>
                    <div style={style.DetailsBoxChild}>
                      <label style={style.headingTitle}>Established Date : </label>
                      <span style={style.SubTitle}>{selectedCompany.estd_date}</span>
                    </div>
                  </div>
                  <div style={style.DetailsBoxMain}>
                    <div style={style.DetailsBoxChildD}>
                      <label style={style.headingTitle}>Address Line 1 : </label>
                      <span style={style.SubTitle}>{selectedCompany.line_1}</span>
                    </div>
                  </div>
                  <div style={style.DetailsBoxMain}>
                    <div style={style.DetailsBoxChildD}>
                      <label style={style.headingTitle}>Address Line 2 : </label>
                      <span style={style.SubTitle}>{selectedCompany.line_2}</span>
                    </div>
                  </div>
                  <div style={style.DetailsBoxMain}>
                    <div style={style.DetailsBoxChildD}>
                      <label style={style.headingTitle}>About : </label>
                      <span style={style.SubTitle}>{selectedCompany.about}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>No details available</p>
          )}
        </Box>
      </Modal>
    </div>
  );
};

CompanyList.propTypes = {
  searchString: PropTypes.string, // Ensure it's a required string
};
CompanyList.defaultProps = {
  searchString: "",
};

export default CompanyList;
