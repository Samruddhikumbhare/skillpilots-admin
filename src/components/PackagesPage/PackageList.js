import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid"; // Assuming you're using DataGrid from Material-UI
import axios from "axios";
import { api } from "../../Api";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import { Box, Button, CircularProgress, Modal } from "@mui/material";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const getPackageDataApi = async () => {
  try {
    const res = await axios.get(api + "/newskill/getPackages");
    const formattedData = res.data.packgedata.map((row, index) => ({
      ...row,
      id: index + 1,
      effective_date: formatDate(row.effective_date),
      expiration_date: formatDate(row.expiration_date),
    }));
    return formattedData;
  } catch (err) {
    console.log("err", err);
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
const PackageList = ({ searchString }) => {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [open, setOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  const [loader, setLoader] = useState(false);
  const [selectedData, setSelectedData] = useState({}); // Store API response data here

  useEffect(() => {
    setLoader(true);
    getPackageDataApi()
      .then((formattedData) => {
        setData(formattedData);
        setLoader(false);
        setFilterData(formattedData);
      })
      .catch((err) => {
        setLoader(false);
      });
  }, []);
  const handleClose = () => setOpen(false);
  const viewDetails = (item) => {
    setOpen(true);
    setSelectedData(item.row);
  };
  useEffect(() => {
    if (searchString == "") {
      setData(filterData);
    } else {
      const filterdatalist = data.filter(
        (entry) =>
          entry?.package_name.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.package_type.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.package_for.toLowerCase().includes(searchString.toLowerCase())
      );

      setData(filterdatalist);
    }
  }, [searchString]);
  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  function exportToExcel(data, fileName = "data.xlsx") {
    const headerMap = {
      package_name: "Package Name",
      amount: "Amount",
      package_type: "Type",
      package_for: "Package For",
      validity: "Validity",
      no_of_internships: "Internships",
      no_of_dept: "Department",
      effective_date: "Effective Date",
      expiration_date: "Expiration Date",
      package_desc: "Description",
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
    exportToExcel(data, "package.xlsx");
  };

  const columns = [
    // Define columns for your table
    // { sortable: false, field:  "id", headerName: "ID", width: 70 },
    { sortable: false, field: "package_name", headerName: "Name", width: 200 },
    { sortable: false, field: "amount", headerName: "Amount", width: 90 },
    { sortable: false, field: "package_type", headerName: "Type", width: 100 },
    { sortable: false, field: "package_for", headerName: "Package For", width: 120 },
    { sortable: false, field: "validity", headerName: "Validity", width: 90 },
    { sortable: false, field: "no_of_internships", headerName: "Internships", width: 90 },
    { sortable: false, field: "no_of_dept", headerName: "Total Department", width: 150 },
    { sortable: false, field: "effective_date", headerName: "Effective Date", width: 120 },
    { sortable: false, field: "expiration_date", headerName: "Expiration Date", width: 120 },
    {
      sortable: false,
      field: "details",
      headerName: "Action",
      width: 80,
      renderCell: (params) => (
        <Button
          data-toggle="tooltip"
          title="View"
          variant="contained"
          size="small"
          style={{ background: "#3791ee", color: "white" }}
          color=""
          onClick={() => viewDetails(params)} // Pass the selected email to fetch company details
        >
          <i className="fa fa-info-circle" style={{ fontSize: "17px" }} aria-hidden="true"></i>

          {/* Show Details */}
        </Button>
      ),
    },
    // { sortable: false, field:  "", headerName: "Status", width: 70 },
    // Add more columns as needed
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
          getRowId={(row) => row.id} // Specify the id property for each row
          paginationModel={paginationModel} // Make sure this is initialized correctly
          pageSize={paginationModel.pageSize}
          onPaginationModelChange={handlePaginationChange}
        />
      ) : (
        <div style={{ padding: "10px 15px", fontSize: "18px", fontWeight: "600" }}>Not found</div>
      )}
      {/* ***********************package Details********************* */}
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
                <h4>Package Details</h4>
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
                    <label style={style.headingTitle}>Package Name : </label>
                    <span style={style.SubTitle}>{selectedData.package_name}</span>
                  </div>

                  <div style={style.DetailsBoxChild}>
                    <label style={style.headingTitle}>Package Type : </label>
                    <span style={style.SubTitle}>{selectedData.package_type}</span>
                  </div>
                </div>

                <div style={style.DetailsBoxMain}>
                  <div style={style.DetailsBoxChild}>
                    <label style={style.headingTitle}>Amount : </label>
                    <span style={style.SubTitle}>{selectedData.amount}</span>
                  </div>

                  <div style={style.DetailsBoxChild}>
                    <label style={style.headingTitle}>No of Department : </label>
                    <span style={style.SubTitle}>{selectedData.no_of_dept}</span>
                  </div>
                </div>

                <div style={style.DetailsBoxMain}>
                  <div style={style.DetailsBoxChild}>
                    <label style={style.headingTitle}>No of Internships : </label>
                    <span style={style.SubTitle}>{selectedData.no_of_internships}</span>
                  </div>
                  <div style={style.DetailsBoxChild}>
                    <label style={style.headingTitle}>Package for : </label>
                    <span style={style.SubTitle}>{selectedData.package_for}</span>
                  </div>
                </div>

                <div style={style.DetailsBoxMain}>
                  <div style={style.DetailsBoxChild}>
                    <label style={style.headingTitle}>Validity : </label>
                    <span style={style.SubTitle}>{selectedData.validity}</span>
                  </div>
                </div>
                <div style={style.DetailsBoxMain}>
                  <div style={style.DetailsBoxChildD}>
                    <label style={style.headingTitle}>Package Description : </label>
                    <span style={style.SubTitle}>{selectedData.package_desc}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

PackageList.propTypes = {
  searchString: PropTypes.string, // Ensure it's a required string
};
PackageList.defaultProps = {
  searchString: "",
};

export default PackageList;
