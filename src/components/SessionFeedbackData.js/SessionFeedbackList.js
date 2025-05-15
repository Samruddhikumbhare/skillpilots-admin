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
} from "@mui/material";
import { api } from "../../Api";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import { Close } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";

const getSessionFeedbackDataApi = async () => {
  try {
    const res = await axios.get(api + "/newskill/feedbackAll");
    if (res.data && Array.isArray(res.data)) {
      const formattedData = res.data.map((row, index) => ({
        id: index + 1,
        name: row.name,
        college: row.college,
        department: row.department,
        year: row.year,
        email: row.email,
        contact: row.contact,
        rating: row.rating,
        relevance: row.relevance,
        engagement: row.engagement,
        clarity: row.clarity,
        confidence: row.confidence,
        helpfulParts: row.helpfulParts,
        applyInsights: row.applyInsights,
        improvements: row.improvements,
        recommend: row.recommend,
        comments: row.comments,
        createdDate: new Date(row.createdDate).toLocaleDateString("en-GB"),
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
const SessionFeedbackList = ({ searchString }) => {
  const isScreenLarge = useMediaQuery("(max-width:700px)");
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSessionFeedback, setSelectedSessionFeedback] = useState(null); // Store API response data here
  const [filterdata, setFilterData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  const [loaderSessionFeedback, setSessionFeedbackLoader] = useState(false);
  // Handle page and page size change

  useEffect(() => {
    setSessionFeedbackLoader(true);
    getSessionFeedbackDataApi()
      .then((formattedData) => {
        setData(formattedData);
        setSessionFeedbackLoader(false);
        setFilterData(formattedData);
      })
      .catch((err) => {
        setSessionFeedbackLoader(false);
      });
  }, []);

  const handleCellClick = (params) => {
    handleOpen(params.row);
  };
  // Fetch SessionFeedback details by email
  const handleOpen = async (rowData) => {
    console.log(rowData);
    setSelectedSessionFeedback(rowData); // Correctly store company data in the state

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
      const filterdatalist = data.filter(
        (entry) =>
          entry?.name.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.email.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.college.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.year.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.createdDate.toLowerCase().includes(searchString.toLowerCase())
      );

      setData(filterdatalist);
    }
  }, [searchString]);

  function exportToExcel(data, fileName = "data.xlsx") {
    const headerMap = {
      name: "Full Name",
      college: "College/Institution Name",
      department: "Department",
      year: "Year",
      email: "Email Id",
      contact: "Contact Number",
      rating: "How would you rate the overall session?",
      relevance: "Was the session content relevant to your career needs?",
      engagement:
        "How engaging did you find the session activities (discussions, exercises, etc.)?",
      clarity: "Did the session help you clarify your career direction?",
      confidence: "How confident are you in setting career goals after attending the session?",
      helpfulParts: "Which part of the session did you find most helpful?",
      applyInsights: "How do you plan to apply the insights gained from this session?",
      improvements: "What aspects of the session would you like to see improved?",
      recommend: "Would you recommend this session to others?",
      comments: "Any additional comments or suggestions?",
      createdDate: "Date",
    };

    // Extract custom headers dynamically
    const headers = Object.values(headerMap);
    const formatArray = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");

    // Convert JSON to an array with mapped column headers
    const rows = data.map((item) =>
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
    exportToExcel(data, "session_feedback_list.xlsx");
  };

  const columns = [
    { sortable: false, field: "id", headerName: "Sr.", width: 10 },
    {
      sortable: false,
      field: "name",
      headerName: "Name",
      width: 230,
      renderCell: (params) => (
        <div
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => {
            handleCellClick(params);
          }}
        >
          {params.row.name}
        </div>
      ),
    },
    { sortable: false, field: "email", headerName: "Email Id", width: 260 },
    { sortable: false, field: "contact", headerName: "Contact", width: 120 },
    { sortable: false, field: "college", headerName: "College", width: 195 },
    { sortable: false, field: "year", headerName: "Year", width: 120 },

    { sortable: false, field: "createdDate", headerName: "Date", width: 100 },

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
          onClick={() => handleOpen(params.row)} // Pass the selected email to fetch SessionFeedback details
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
      {loaderSessionFeedback ? (
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
            top: "0",
            left: isScreenLarge ? "0%" : "10%",
            width: isScreenLarge ? "calc(100% - 20px)" : "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            margin: "10px",
          }}
        >
          {selectedSessionFeedback ? (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold">
                  Session Feedback Details
                </Typography>
                <Close onClick={handleClose} style={{ cursor: "pointer" }} />
              </Box>
              <Divider />
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Box pl={2}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={selectedSessionFeedback.name}
                    margin="normal"
                    disabled
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="College/Institution Name"
                    value={selectedSessionFeedback.college}
                    margin="normal"
                    disabled
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="Department"
                    value={selectedSessionFeedback.department}
                    margin="normal"
                    disabled
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="Year"
                    value={selectedSessionFeedback.year}
                    margin="normal"
                    disabled
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="Email Id"
                    value={selectedSessionFeedback.email}
                    margin="normal"
                    disabled
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="Contact Number"
                    value={selectedSessionFeedback.contact}
                    margin="normal"
                    disabled
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>
              <Divider />

              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Session Feedback
                </Typography>
                <Box pl={2} className="sessionFeedback">
                  <FormControl fullWidth component="fieldset" margin="normal">
                    <FormLabel style={{ fontSize: "14px", marginTop: "10px" }} component="legend">
                      How would you rate the overall session?
                    </FormLabel>
                    <RadioGroup style={{ fontSize: "14px" }} value={selectedSessionFeedback.rating}>
                      {[
                        "⭐⭐⭐⭐⭐ Excellent",
                        "⭐⭐⭐⭐ Good",
                        "⭐⭐⭐ Average",
                        "⭐⭐ Poor",
                        "⭐ Very Poor",
                      ].map((option) => (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>

                  <FormControl fullWidth component="fieldset" margin="normal">
                    <FormLabel style={{ fontSize: "14px", marginTop: "10px" }} component="legend">
                      Was the session content relevant to your career needs?
                    </FormLabel>
                    <RadioGroup
                      style={{ fontSize: "14px" }}
                      value={selectedSessionFeedback.relevance}
                    >
                      {["Yes, very relevant", "Somewhat relevant", "Not relevant at all"].map(
                        (option) => (
                          <FormControlLabel
                            key={option}
                            value={option}
                            control={<Radio />}
                            label={option}
                          />
                        )
                      )}
                    </RadioGroup>
                  </FormControl>

                  <FormControl fullWidth component="fieldset" margin="normal">
                    <FormLabel style={{ fontSize: "14px", marginTop: "10px" }} component="legend">
                      How engaging did you find the session activities (discussions, exercises,
                      etc.)?
                    </FormLabel>
                    <RadioGroup
                      style={{ fontSize: "14px" }}
                      value={selectedSessionFeedback.engagement}
                    >
                      {["Very engaging", "Engaging", "Neutral", "Not engaging"].map((option) => (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>

                  <FormControl fullWidth component="fieldset" margin="normal">
                    <FormLabel style={{ fontSize: "14px", marginTop: "10px" }} component="legend">
                      Did the session help you clarify your career direction?
                    </FormLabel>
                    <RadioGroup
                      style={{ fontSize: "14px" }}
                      value={selectedSessionFeedback.clarity}
                    >
                      {["Yes, definitely", "Somewhat", "No, not at all"].map((option) => (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>

                  <FormControl fullWidth component="fieldset" margin="normal">
                    <FormLabel style={{ fontSize: "14px", marginTop: "10px" }} component="legend">
                      How confident are you in setting career goals after attending the session?
                    </FormLabel>
                    <RadioGroup
                      style={{ fontSize: "14px" }}
                      value={selectedSessionFeedback.confidence}
                    >
                      {["Very confident", "Somewhat confident", "Not confident at all"].map(
                        (option) => (
                          <FormControlLabel
                            key={option}
                            value={option}
                            control={<Radio />}
                            label={option}
                          />
                        )
                      )}
                    </RadioGroup>
                  </FormControl>

                  <FormControl fullWidth component="fieldset" margin="normal">
                    <FormLabel style={{ fontSize: "14px", marginTop: "10px" }} component="legend">
                      Which part of the session did you find most helpful?
                    </FormLabel>
                    {[
                      "Self-discovery and personality assessment",
                      "Career exploration and industry trends",
                      "Decision-making frameworks",
                      "Action plan and execution",
                      "Networking and mentorship tips",
                      "No one",
                    ].map((part) => (
                      <FormControlLabel
                        key={part}
                        control={
                          <Checkbox
                            value={part}
                            checked={selectedSessionFeedback.helpfulParts.includes(part)}
                          />
                        }
                        label={part}
                      />
                    ))}
                  </FormControl>

                  <FormControl fullWidth component="fieldset" margin="normal">
                    <FormLabel style={{ fontSize: "14px", marginTop: "10px" }} component="legend">
                      How do you plan to apply the insights gained from this session?
                    </FormLabel>
                    <TextField
                      fullWidth
                      value={selectedSessionFeedback.applyInsights}
                      margin="normal"
                      multiline
                      rows={4}
                    />
                  </FormControl>

                  <FormControl fullWidth component="fieldset" margin="normal">
                    <FormLabel style={{ fontSize: "14px", marginTop: "10px" }} component="legend">
                      What aspects of the session would you like to see improved?
                    </FormLabel>
                    <TextField
                      fullWidth
                      value={selectedSessionFeedback.improvements}
                      margin="normal"
                      multiline
                      rows={4}
                    />
                  </FormControl>

                  <FormControl fullWidth component="fieldset" margin="normal">
                    <FormLabel style={{ fontSize: "14px", marginTop: "10px" }} component="legend">
                      Would you recommend this session to others?
                    </FormLabel>
                    <RadioGroup
                      style={{ fontSize: "14px" }}
                      value={selectedSessionFeedback.recommend}
                    >
                      {["Yes", "Maybe", "No"].map((option) => (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>

                  <FormControl fullWidth component="fieldset" margin="normal">
                    <FormLabel style={{ fontSize: "14px", marginTop: "10px" }} component="legend">
                      Any additional comments or suggestions?
                    </FormLabel>
                    <TextField
                      fullWidth
                      value={selectedSessionFeedback.comments}
                      margin="normal"
                      multiline
                      rows={3}
                    />
                  </FormControl>
                </Box>
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

SessionFeedbackList.propTypes = {
  searchString: PropTypes.string, // Ensure it's a required string
};
SessionFeedbackList.defaultProps = {
  searchString: "",
};

export default SessionFeedbackList;
