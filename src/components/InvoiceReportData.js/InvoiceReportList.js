import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Button, Box, CircularProgress, TextField, FormControl } from "@mui/material";
import { api } from "../../Api";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import useMediaQuery from "@mui/material/useMediaQuery";

const getInvoiceReportDataApi = async () => {
  try {
    const res = await axios.get(api + "/newskill/getAllHistory");
    if (res.data && Array.isArray(res.data)) {
      const formattedData = res.data.map((row, index) => ({
        id: index + 1,
        ...row,
        amount: Number(row.paidAmount - row.paidAmount * (18 / 100)).toFixed(2),
        tax: Number(row.paidAmount * (18 / 100)).toFixed(2),
      }));
      return formattedData;
    } else {
      console.error("Unexpected data structure", res.data);
      return [];
    }
  } catch (err) {
    console.error("Error fetching session feedback data:", err);
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
const InvoiceReportList = ({ searchString }) => {
  const [inputFilter, setInputFilter] = useState({
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2)
      .toISOString()
      .split("T")[0], // First date of the current month
    toDate: new Date().toISOString().split("T")[0], // Today's date
  });

  const [formErrors, setFormErrors] = useState({
    fromDate: "",
    toDate: "",
  });
  const isScreenLarge = useMediaQuery("(max-width:700px)");
  const [data, setData] = useState([]);

  const [filterdata, setFilterData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  const [loaderInvoiceReport, setInvoiceReportLoader] = useState(false);
  // Handle page and page size change

  useEffect(() => {
    setInvoiceReportLoader(true);
    getInvoiceReportDataApi()
      .then((formattedData) => {
        setData(formattedData);

        const filteredData = formattedData
          .filter((row) => {
            const rowDate = new Date(row.paymentDate); // Convert row date to Date object
            return (
              rowDate >= new Date(inputFilter.fromDate) && rowDate <= new Date(inputFilter.toDate)
            ); // Filter between fromDate and toDate
          })
          .map((row, index) => ({ ...row }));

        setFilterData(filteredData);
        setInvoiceReportLoader(false);
      })
      .catch((err) => {
        setInvoiceReportLoader(false);
      });
  }, []);

  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  useEffect(() => {
    if (searchString == "") {
      setFilterData(filterdata);
    } else {
      console.log(data);
      const filterdatalist = filterdata.filter(
        (entry) =>
          entry?.receiptNumber?.toLowerCase().includes(searchString) ||
          entry?.username?.toLowerCase().includes(searchString.toLowerCase())
      );

      setFilterData(filterdatalist);
    }
  }, [searchString]);

  function exportToExcel(filterdata, fileName = "data.xlsx") {
    const headerMap = {
      receiptNumber: "Invoice No.",
      username: "Name",
      amount: "Amount",
      tax: "Tax(18%)",
      paidAmount: "Total Amount",
      paymentDate: "Date",
    };

    // Extract custom headers dynamically
    const headers = Object.values(headerMap);
    const formatArray = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");

    // Convert JSON to an array with mapped column headers
    const rows = filterdata.map((item) =>
      Object.keys(headerMap).map((key) =>
        key === "helpfulParts" ? formatArray(item[key]) : item[key] || ""
      )
    );

    // Combine headers and data
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
  }

  const handleDownload = () => {
    exportToExcel(filterdata, "invoice_report.xlsx");
  };

  const columns = [
    { sortable: false, field: "id", headerName: "Sr.", width: 10 },
    {
      sortable: false,
      field: "receiptNumber",
      headerName: "Invoice No.",
      width: 230,
    },
    { sortable: false, field: "username", headerName: "Name", width: 260 },
    {
      sortable: false,
      field: "amount",
      headerName: "Amount",
      width: 120,
    },
    {
      sortable: false,
      field: "tax",
      headerName: "Tax(18%)",
      width: 120,
    },
    { sortable: false, field: "paidAmount", headerName: "Total Amount", width: 180 },
    { sortable: false, field: "paymentDate", headerName: "Date", width: 110 },
  ];

  useEffect(() => {
    if (inputFilter.toDate !== "" && inputFilter.fromDate !== "") {
      const filteredData = data.filter((row) => {
        const rowDate = new Date(`${row.paymentDate}`); // YYYY-MM-DD format

        return rowDate >= new Date(inputFilter.fromDate) && rowDate <= new Date(inputFilter.toDate); // Filter between fromDate and toDate
      });

      setFilterData(filteredData);
    }
  }, [data, inputFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputFilter({
      ...inputFilter,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: value === "" ? "Select the Date" : "",
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ paddingBottom: "10px", display: "flex", justifyContent: "space-between" }}>
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
            <TextField
              label="From Date"
              name="fromDate"
              type="date"
              value={inputFilter.fromDate}
              onChange={handleChange}
              error={Boolean(formErrors.fromDate)}
              helperText={formErrors.fromDate}
              InputLabelProps={{ shrink: true }} // 👈 Ensures the label stays shrunk
              fullWidth
            />
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <TextField
              label="To Date"
              name="toDate"
              type="date"
              value={inputFilter.toDate}
              onChange={handleChange}
              error={Boolean(formErrors.toDate)}
              helperText={formErrors.toDate}
              InputLabelProps={{ shrink: true }} // 👈 Ensures the label stays shrunk
              fullWidth
            />
          </FormControl>
        </Box>
        <Button
          variant="contained"
          color=""
          style={{ backgroundColor: "#78b7f2", color: "white" }}
          onClick={handleDownload}
        >
          Download Excel
        </Button>
      </div>
      {loaderInvoiceReport ? (
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
      ) : filterdata.length > 0 ? (
        <DataGrid
          rows={filterdata}
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
    </div>
  );
};

InvoiceReportList.propTypes = {
  searchString: PropTypes.string, // Ensure it's a required string
};
InvoiceReportList.defaultProps = {
  searchString: "",
};

export default InvoiceReportList;
