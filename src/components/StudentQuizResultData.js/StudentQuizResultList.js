import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Switch,
  Button,
  Modal,
  Box,
  CircularProgress,
  Typography,
  TextField,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  Checkbox,
  Select,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { api } from "../../Api";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import { Close } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";

const getStudentQuizResultDataApi = async () => {
  try {
    const res = await axios.get(api + "/newskill/test-attempts");
    if (res.data && Array.isArray(res.data)) {
      console.log(res.data);
      const formattedData = res.data.map((row, index) => ({
        ...row,
        id: index + 1,
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
const StudentQuizResultList = ({ searchString }) => {
  const isScreenLarge = useMediaQuery("(max-width:700px)");
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStudentQuizResult, setSelectedStudentQuizResult] = useState(null); // Store API response data here
  const [filterdata, setFilterData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  const [loaderStudentQuizResult, setStudentQuizResultLoader] = useState(false);
  // Handle page and page size change

  useEffect(() => {
    setStudentQuizResultLoader(true);
    getStudentQuizResultDataApi()
      .then((formattedData) => {
        setData(formattedData);
        setStudentQuizResultLoader(false);
        setFilterData(formattedData);
      })
      .catch((err) => {
        setStudentQuizResultLoader(false);
      });
  }, []);

  // Fetch StudentQuizResult details by email
  const handleOpen = async (rowData) => {
    console.log(rowData);
    setSelectedStudentQuizResult(rowData); // Correctly store company data in the state

    setOpen(true); // Open the modal regardless of success or failure
  };
  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (searchString == "") {
      setData(filterdata);
    } else {
      const filterdatalist = data.filter((entry) =>
        entry?.username.toLowerCase().includes(searchString.toLowerCase())
      );

      setData(filterdatalist);
    }
  }, [searchString]);

  const columns = [
    { sortable: false, field: "id", headerName: "Sr.", width: 100 },
    {
      sortable: false,
      field: "username",
      headerName: "Name",
      width: 350,
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
          onClick={() => handleOpen(params.row)} // Pass the selected email to fetch StudentQuizResult details
        >
          <i className="fa fa-info-circle" style={{ fontSize: "17px" }} aria-hidden="true"></i>

          {/* Show Details */}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      {loaderStudentQuizResult ? (
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
      <Modal open={open} onClose={handleClose} style={{ overflow: "auto", width: "100%" }}>
        <Box
          sx={{
            position: "absolute",
            top: "2%",
            left: isScreenLarge ? "0%" : "10%",
            width: isScreenLarge ? "calc(100% - 20px)" : "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
            margin: "10px",
          }}
        >
          {selectedStudentQuizResult ? (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold">
                  {selectedStudentQuizResult.username} Test Result
                </Typography>
                <Close onClick={handleClose} style={{ cursor: "pointer" }} />
              </Box>
              <hr />

              {/* Attempt Details Table */}
              <Box mt={2} mb={2}>
                <Typography variant="h6" gutterBottom>
                  Quiz Attempts
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{ width: "100%", height: "70vh", overflow: "auto", mt: 2 }}
                >
                  <Table>
                    <TableRow>
                      <TableCell>
                        <strong>Test Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Level</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Marks</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Percentage</strong>
                      </TableCell>{" "}
                      <TableCell>
                        <strong>Date</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                    </TableRow>

                    {selectedStudentQuizResult.attempts?.map((attempt, index) => (
                      <TableRow key={index}>
                        <TableCell>{attempt.testName}</TableCell>
                        <TableCell>{attempt.questionLevel}</TableCell>
                        <TableCell>
                          {attempt.score} / {attempt.outOfMarks}
                        </TableCell>
                        <TableCell>
                          {attempt.outOfMarks === 0
                            ? "0"
                            : Number((attempt.score / attempt.outOfMarks) * 100).toFixed(2)}
                          %
                        </TableCell>{" "}
                        <TableCell>{attempt.createdAt}</TableCell>
                        <TableCell
                          sx={{
                            color:
                              attempt.status === "PASSED"
                                ? "green"
                                : attempt.status === "FAILED"
                                ? "#ff690d"
                                : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {attempt.status === "D" ? "DISQUALIFIED" : attempt.status}
                        </TableCell>
                      </TableRow>
                    ))}
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          ) : (
            <Typography variant="h6" align="center">
              No details available
            </Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
};

StudentQuizResultList.propTypes = {
  searchString: PropTypes.string, // Ensure it's a required string
};
StudentQuizResultList.defaultProps = {
  searchString: "",
};

export default StudentQuizResultList;
