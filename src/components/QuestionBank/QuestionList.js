import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { api } from "../../Api";
import EditQue from "components/Modal/EditQue";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import { Edit } from "@mui/icons-material";
const getOnlineTestDataApi = async () => {
  try {
    const res = await axios.get(api + "/newskill/getQuestions");

    // Flatten the questions and filter out strings
    const flattenedData = res.data.Questions.flat().filter((row) => typeof row === "object");

    const formattedData = flattenedData.map((row, index) => ({
      ...row,
      id: row.id || index, // Ensure each row has a unique id
    }));

    return formattedData;
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err;
  }
};

const QuestionList2 = ({ searchString }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterdata, setFilterData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  useEffect(() => {
    TestList();
  }, []);

  const TestList = () => {
    getOnlineTestDataApi()
      .then((formattedData) => {
        setData(formattedData);
        setFilteredData(formattedData);
        setFilterData(formattedData);
        // console.log("Formatted data:", formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleToggleEditModal = (id) => {
    const rowData = data.find((row) => row.id === id);
    setEditData(rowData);
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);
    applyFilters(value, difficultyFilter);
  };

  const handleDifficultyFilterChange = (event) => {
    const value = event.target.value;
    setDifficultyFilter(value);
    applyFilters(filterValue, value);
  };

  const applyFilters = (correctAnswer, difficulty) => {
    let filtered = data;
    if (correctAnswer !== "") {
      filtered = filtered.filter((row) => row.correctAnswer === correctAnswer);
    }
    if (difficulty !== "") {
      filtered = filtered.filter((row) => row.difficultyLevel === difficulty);
    }
    setFilteredData(filtered);
  };
  useEffect(() => {
    if (searchString == "") {
      setFilteredData(filterdata);
    } else {
      const filterdatalist = data.filter(
        (entry) =>
          entry?.text.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.option1.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.option2.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.option3.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.option4.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.correctAnswer.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.difficultyLevel.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.marksques.toString().toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.type.toLowerCase().includes(searchString.toLowerCase())
      );

      setFilteredData(filterdatalist);
    }
  }, [searchString]);

  function exportToExcel(data, fileName = "data.xlsx") {
    const headerMap = {
      text: "Name",
      option1: "Option 1",
      option2: "Option 2",
      option3: "Option 3",
      option4: "Option 4",
      correctAnswer: "Answer",
      difficultyLevel: "Difficulty",
      marksques: "Marks",
      type: "Type",
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
    exportToExcel(data, "question.xlsx");
  };
  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };
  const columns = [
    { sortable: false, field: "text", headerName: "Name", width: 200 },
    { sortable: false, field: "option1", headerName: "Option 1", width: 120 },
    { sortable: false, field: "option2", headerName: "Option 2", width: 120 },
    { sortable: false, field: "option3", headerName: "Option 3", width: 120 },
    { sortable: false, field: "option4", headerName: "Option 4", width: 120 },
    { sortable: false, field: "correctAnswer", headerName: "Answer", width: 120 },
    { sortable: false, field: "difficultyLevel", headerName: "Difficulty", width: 100 },
    { sortable: false, field: "marksques", headerName: "Marks", width: 70 },
    { sortable: false, field: "type", headerName: "Type", width: 120 },
    // { sortable: false, field: "examId", headerName: "Exam ID", width: 100 },
    {
      sortable: false,
      field: "actions",
      headerName: "Actions",
      width: 80,
      renderCell: (params) => (
        <>
          <IconButton
            variant="contained"
            size="small"
            color="info"
            onClick={() => handleToggleEditModal(params.row.id)}
            style={{ marginRight: 8 }}
          >
            <Edit />
          </IconButton>
          {/* <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row.id)}
            style={{ marginRight: 8 }}
          >
            Delete
          </Button> */}
        </>
      ),
    },
  ];

  return (
    <>
      {/* <FormControl style={{ marginBottom: 16, minWidth: 120, width: "10%" }}>
        <InputLabel>Filter by Answer</InputLabel>
        <Select value={filterValue} onChange={handleFilterChange}>
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {[...new Set(data.map((item) => item.correctAnswer))].map((answer, index) => (
            <MenuItem key={index} value={answer}>
              {answer}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}

      <div style={{ width: "100%" }}>
        <div
          style={{
            paddingBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Filter by Difficulty</InputLabel>
            <Select
              label="Filter by Difficulty"
              value={difficultyFilter}
              onChange={handleDifficultyFilterChange}
              sx={{ color: "blue", height: "44px" }}
            >
              <MenuItem value="">All</MenuItem>
              {[
                ...new Set(
                  data.map((item) => item.difficultyLevel).filter((difficulty) => difficulty)
                ),
              ] // Remove empty/null values
                .map((difficulty, index) => (
                  <MenuItem key={index} value={difficulty}>
                    {difficulty.toUpperCase()}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color=""
            style={{ backgroundColor: "#78b7f2", color: "white" }}
            onClick={handleDownload}
          >
            Download Excel
          </Button>
        </div>
        {filteredData.length > 0 ? (
          <DataGrid
            rows={filteredData}
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
          <div style={{ display: "block", position: "relative", left: "50%", top: "50%" }}>
            <CircularProgress color="info" />
          </div>
        )}

        {isEditModalOpen && editData && (
          <EditQue
            editData={editData}
            handleClose={() => setIsEditModalOpen(false)}
            getOnlineTestDataApi={TestList}
            isEditModalOpen={isEditModalOpen}
          />
        )}
      </div>
    </>
  );
};
QuestionList2.propTypes = {
  searchString: PropTypes.string, // Ensure it's a required string
};
QuestionList2.defaultProps = {
  searchString: "",
};
export default QuestionList2;
