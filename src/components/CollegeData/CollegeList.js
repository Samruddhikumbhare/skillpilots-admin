import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Switch, Button, Modal, Box, CircularProgress, MenuItem, Select } from "@mui/material";
import { api } from "../../Api";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import { Edit } from "@mui/icons-material";
import Swal from "sweetalert2";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const handleToggle = async (id, newStatus, setData) => {
  try {
    const updatedStatus = newStatus ? 1 : 0; // Convert boolean to 0 or 1
    await axios.put(api + `/newskill/updateCollege?college_id=${id}`, {
      id,
      status: updatedStatus,
    });
    setData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, status: updatedStatus } : row))
    );
  } catch (error) {
    console.log("Error updating status:", error);
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

const getCollegeDataApi = async () => {
  try {
    const res = await axios.get(api + "/newskill/getAllCollege");

    if (res.data && Array.isArray(res.data.allColleges)) {
      const formattedData = res.data.allColleges.map((row) => ({
        id: row[0],
        username: row[1],
        contact_no: row[2],
        balance: row[4],
        validity: formatDate(row[6]),
        email: row[5],
        creationDate: formatDate(row[6]),
        package_name: row[7],
        status: row[3] || false,
        paymentBy: row[9] || "",
        clgId: row[10] || "",
      }));
      return formattedData;
    } else {
      console.error("Unexpected data structure", res.data);
      return [];
    }
  } catch (err) {
    console.error("Error fetching college data:", err);
    throw err;
  }
};

const CollegeList = ({ searchString }) => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null); // Store API response data here
  const [loading, setLoading] = useState(false); // Track loading state
  const [filterdata, setFilterData] = useState([]);
  const [rowCount, setRowCount] = useState(0); // Total number of items
  const [loader, setLoader] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });

  const [openPayment, setOpenPayment] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedPaymentBy, setSelectedPaymentBy] = useState("");

  const handleOpenPayment = (row) => {
    setSelectedRow(row);
    console.log(row);
    setSelectedPaymentBy(row.paymentBy);
    setOpenPayment(true);
  };

  const handleClosePayment = () => {
    setOpenPayment(false);
  };

  const handlePaymentChange = (event) => {
    setSelectedPaymentBy(event.target.value);
  };

  const handleSavePayment = async () => {
    if (!selectedRow) return;

    await axios
      .post(api + "/newskill/addPaymentStatus", {
        collegeId: selectedRow.clgId,
        status: selectedPaymentBy,
      })
      .then((response) => {
        getCollege();
        handleClosePayment();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Payment By Update Successfully.",
        });
      })
      .catch((error) => {
        handleClosePayment();
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Something went wrong...",
        });
      });
  };

  useEffect(() => {
    getCollege();
  }, []);
  const getCollege = () => {
    setLoader(true);
    getCollegeDataApi()
      .then((formattedData) => {
        console.log(formattedData);
        setData(formattedData);
        setRowCount(formattedData?.length);
        setFilterData(formattedData);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
      });
  };
  useEffect(() => {
    if (searchString == "") {
      setData(filterdata);
    } else {
      const filterdatalist = data.filter(
        (entry) =>
          entry?.username.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.email.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.package_name.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.validity.toLowerCase().includes(searchString.toLowerCase())
      );

      setData(filterdatalist);
    }
  }, [searchString]);
  // Fetch college details by email
  const handleOpen = async (email) => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/newskill/collegeInfo?email=${email}`);
      if (res.data && res.data.College) {
        setSelectedCollege(res.data.College); // Store the API response in state
      } else {
        console.error("College not found:", res.data);
      }
    } catch (error) {
      console.error("Error fetching college details:", error);
    } finally {
      setLoading(false);
      setOpen(true); // Open the modal regardless of success or failure
    }
  };

  function exportToExcel(data, fileName = "data.xlsx") {
    const headerMap = {
      username: "Name",
      email: "Email Id",
      contact_no: "Contact Number",
      package_name: "Package Name",
      balance: "Balance",
      status: "Status",
      paymentBy: "Payment By",
      validity: "Date",
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

  const handleClose = () => setOpen(false);
  const handleDownload = () => {
    exportToExcel(data, "college_list.xlsx");
  };
  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };
  const columns = [
    // { sortable: false, field:  "id", headerName: "ID", width: 100 },
    {
      sortable: false,
      field: "username",
      headerName: "Name",
      width: 300,
      sortable: false,
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
    { sortable: false, field: "email", headerName: "Email", width: 200 },
    { sortable: false, field: "contact_no", headerName: "Contact", width: 100 },
    {
      sortable: false,
      field: "package_name",
      headerName: "Package Name",
      sortable: false,
      width: 150,
    },
    { sortable: false, field: "balance", headerName: "Balance", width: 80 },
    { sortable: false, field: "validity", headerName: "Validity", width: 100 },
    {
      sortable: false,
      field: "paymentBy",
      headerName: "Payment By",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <div>
          {params.row.paymentBy}{" "}
          <Edit
            style={{ float: "right", marginTop: "15px" }}
            onClick={() => handleOpenPayment(params.row)}
          />
        </div>
      ),
    },
    // { sortable: false, field:  "creationDate", headerName: "Creation Date", width: 150 },
    {
      sortable: false,
      field: "status",
      headerName: "Status",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Switch
          checked={params.value === 1} // If status is 1, switch is "on", otherwise "off"
          onChange={(e) => handleToggle(params.row.id, e.target.checked, setData)}
        />
      ),
    },
    {
      sortable: false,
      field: "details",
      headerName: "Details",
      width: 75,
      sortable: false,
      renderCell: (params) => (
        <Button
          data-toggle="tooltip"
          title="Show Details"
          size="small"
          variant="contained"
          style={{ background: "#3791ee", color: "white" }}
          onClick={() => handleOpen(params.row.email)} // Pass the selected email to fetch college details
        >
          <i className="fa fa-info-circle" style={{ fontSize: "17px" }} aria-hidden="true"></i>
          {/* Show Details */}
        </Button>
      ),
    },
  ];
  const handleCellClick = (params) => {
    handleOpen(params.row.email);
  };
  return (
    <>
      {/* <DashboardNavbar onDataSend={handleChangeSearch} /> */}

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
            style={{ cursor: "pointer" }}
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
            onPaginationModelChange={handlePaginationChange} // Handle both page and page size changes
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
              width: 760,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            {loading ? (
              <p>Loading...</p>
            ) : selectedCollege ? (
              <div>
                <div>
                  <div
                    style={{
                      paddingBottom: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h4>College Details</h4>
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
                      <div style={style.DetailsBoxChildD}>
                        <label style={style.headingTitle}>Name : </label>
                        <span style={style.SubTitle}>{selectedCollege.college_name}</span>
                      </div>
                    </div>

                    <div style={style.DetailsBoxMain}>
                      <div style={style.DetailsBoxChild}>
                        <label style={style.headingTitle}>City : </label>
                        <span style={style.SubTitle}>{selectedCollege.city}</span>
                      </div>
                      <div style={style.DetailsBoxChild}>
                        <label style={style.headingTitle}>State : </label>
                        <span style={style.SubTitle}>{selectedCollege.state}</span>
                      </div>
                    </div>
                    <div style={style.DetailsBoxMain}>
                      <div style={style.DetailsBoxChild}>
                        <label style={style.headingTitle}>Country : </label>
                        <span style={style.SubTitle}>{selectedCollege.country}</span>
                      </div>

                      <div style={style.DetailsBoxChild}>
                        <label style={style.headingTitle}>Registration no : </label>
                        <span style={style.SubTitle}>{selectedCollege.registration_no}</span>
                      </div>
                    </div>

                    <div style={style.DetailsBoxMain}>
                      <div style={style.DetailsBoxChild}>
                        <label style={style.headingTitle}>Contact 1 : </label>
                        <span style={style.SubTitle}>{selectedCollege.contact_1}</span>
                      </div>
                      <div>
                        <label style={style.headingTitle}>Contact 2 : </label>
                        <span style={style.SubTitle}>{selectedCollege.contact_2}</span>
                      </div>
                    </div>

                    <div style={style.DetailsBoxMain}>
                      <div style={style.DetailsBoxChild}>
                        <label style={style.headingTitle}>Website : </label>
                        <span style={style.SubTitle}>{selectedCollege.web_url}</span>
                      </div>

                      <div style={style.DetailsBoxChild}>
                        <label style={style.headingTitle}>Established Date : </label>
                        <span style={style.SubTitle}>{selectedCollege.estd_date}</span>
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

        {/* Modal */}
        <Modal open={openPayment} onClose={handleClosePayment}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 300,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <h5>Payment By</h5>
            <Select
              value={selectedPaymentBy}
              onChange={handlePaymentChange}
              fullWidth
              sx={{ padding: "10px !important", margin: "5px 0 " }}
            >
              <MenuItem value="college">college</MenuItem>
              <MenuItem value="student">student</MenuItem>
            </Select>
            <Button
              onClick={handleSavePayment}
              variant="contained"
              color="primary"
              sx={{ marginTop: 2, color: "white !important" }}
            >
              Save
            </Button>
          </Box>
        </Modal>
      </div>
    </>
  );
};

CollegeList.propTypes = {
  searchString: PropTypes.string, // Ensure it's a required string
};
CollegeList.defaultProps = {
  searchString: "",
};
export default CollegeList;
