// start on 5 march 2025 by medha

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AddQueTest from "components/Modal/AddQueTest";
import { Box, Button, CircularProgress, Grid, IconButton, Modal } from "@mui/material";
import { api } from "../../Api";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import EditTestName from "components/Modal/EditTestName";
import EditSection from "components/Modal/EditSection";
import { Edit } from "@mui/icons-material";
import EditQueTest from "components/Modal/EditQueTest";
import dummyExcel from "../../assets/dummy_question_excel.xlsx";
import UploadQuestionExcelTest from "components/Modal/uploadQuestionExcelTest";

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

  para: {
    fontSize: "14px",
  },
  questions: {
    fontSize: "15px",
    fontWeight: "600",
    color: "gray",
  },
  answer: { fontSize: "14px", marginRight: "15px", padding: "0 5px", borderRadius: "3px" },
};

// get all test list with section and question
export const getTestDataApi = async () => {
  try {
    const res = await axios.get(api + "/newskill/all-test");
    const formattedData = res.data.map((row) => ({
      ...row,
    }));
    return formattedData;
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err;
  }
};

export const TestList = ({ searchString }) => {
  const [data, setData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditTestModalOpen, setIsEditTestModalOpen] = useState(false);
  const [isEditQuestionModalOpen, setIsEditQuestionModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [filterdata, setFilterData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  const [open, setOpen] = useState(false);
  const [SelectedData, setSelectedData] = useState({});
  let basicserialNumber = 1; // Initialize counter
  let interserialNumber = 1; // Initialize counter
  let advserialNumber = 1; // Initialize counter

  useEffect(() => {
    TestList();
  }, []);

  const TestList = () => {
    getTestDataApi()
      .then((formattedData) => {
        setData(formattedData);
        setFilterData(formattedData);
        setLoader(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // upload excel section wise
  const handleToggleUploadModal = (id, testId) => {
    setSelectedRowId(id);
    setSelectedTestId(testId);
    setIsUploadModalOpen((prev) => !prev);
  };

  // open for modal for add question
  const handleToggleAddModal = (id, testId, row) => {
    setSelectedRowId(id);
    setSelectedTestId(testId);
    setEditData(row);
    setIsAddModalOpen((prev) => !prev);
  };

  // open for modal for edit section
  const handleToggleEditModal = (rowData) => {
    setEditData(rowData);
    setIsEditModalOpen(true);
  };

  // open for modal for edit test
  const handleToggleEditTestModal = (rowData) => {
    setEditData({ ...rowData, id: rowData.testId });
    setIsEditTestModalOpen(true);
  };

  // open for modal for edit question
  const handleQuestionEdit = (rowData) => {
    setEditData(rowData);
    setIsEditQuestionModalOpen(true);
  };

  //  status chnage to test
  const handleChangeStatus = (id, stat) => {
    axios
      .put(api + "/newskill/test/" + id + "/status/" + stat)
      .then((res) => {
        Swal.fire({
          title: `Test ${stat ? "Activate" : "Deactivate"} Successfully`,
          icon: "success",
          text: "",
        });
        TestList();
      })
      .catch((err) => {
        Swal.fire({
          title: "Failed",
          icon: "error",
          text: "",
        });
      });
  };

  useEffect(() => {
    if (searchString == "") {
      setData(filterdata);
    } else {
      const filterdatalist = data.filter((entry) =>
        entry?.testName.toLowerCase().includes(searchString.toLowerCase())
      );

      setData(filterdatalist);
    }
  }, [searchString]);

  // download dummy excel
  const handleDownload = () => {
    const fileUrl = dummyExcel; // Path relative to public folder
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = "sample_question.xlsx"; // Set download file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // for pagination
  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  // view modal
  const viewData = (item) => {
    setSelectedData(item);
    setOpen(true);
  };

  // close view modal
  const handleCloseModel = () => setOpen(false);

  console.log(data);
  // Flatten data for DataGrid
  const rows = data.flatMap((test) =>
    test.sections.map((section) => ({
      id: section.id, // Unique row ID
      testId: test.id,
      description: test.description,
      status: test.status,
      testName: test.testName,
      sectionName: section.sectionName,
      marksPerQuestion: test.marksPerQuestion,
      timeLimit: test.timeLimit,
      noOfQuestions: test.noOfQuestions, // Number of questions in section
      questions: section.questions,
      passingMarks: test.passingMarks,
    }))
  );

  // set data
  const columns = [
    {
      sortable: false,
      field: "testName",
      headerName: "Test Name",
      width: 280,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          {params.row.testName}
          <Box mr={2}>
            <IconButton
              size="small"
              data-toggle="tooltip"
              title="Edit Test"
              onClick={() => handleToggleEditTestModal(params.row)}
              style={{ marginRight: 8 }}
            >
              <i className="fa fa-pencil" style={{ color: "#1A73E8" }} aria-hidden="true"></i>
              {/* Edit */}
            </IconButton>
            <IconButton
              size="small"
              title={params.row.status ? "Deactivate Test" : "Activate Test"} // Tooltip changes dynamically
              onClick={() => handleChangeStatus(params.row.testId, !params.row.status)} // Function to toggle status
              sx={{ color: params.row.status ? "green" : "red" }} // Color indication
            >
              {params.row.status ? (
                <i className="fa fa-toggle-on" style={{ fontSize: "17px" }} aria-hidden="true"></i>
              ) : (
                <i className="fa fa-toggle-off" style={{ fontSize: "17px" }} aria-hidden="true"></i>
              )}
            </IconButton>
          </Box>
        </Box>
      ),
    },
    {
      sortable: false,
      field: "sectionName",
      headerName: "Section Name",
      width: 300,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          {params.row.sectionName}
          <Box mr={2}>
            <IconButton
              size="small"
              data-toggle="tooltip"
              title="Edit Section"
              onClick={() => handleToggleEditModal(params.row)}
              style={{ marginRight: 8 }}
            >
              <i className="fa fa-pencil" style={{ color: "#1A73E8" }} aria-hidden="true"></i>
              {/* Edit */}
            </IconButton>
          </Box>
        </Box>
      ),
    },
    { sortable: false, field: "timeLimit", headerName: "Time Limit (min)", width: 150 },
    { sortable: false, field: "noOfQuestions", headerName: "Total Questions", width: 150 },
    {
      sortable: false,
      field: "marksPerQuestion",
      headerName: "Marks Per Question",
      width: 150,
    },
    {
      sortable: false,
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            data-toggle="tooltip"
            title="Add Question"
            onClick={() => handleToggleAddModal(params.row.id, params.row.testId, params.row)}
            style={{ marginRight: 8 }}
          >
            <i className="fa fa-plus" aria-hidden="true"></i>
            {/* Add Que */}
          </IconButton>
          <IconButton
            size="small"
            data-toggle="tooltip"
            title="View"
            onClick={() => viewData(params.row)} // Pass the selected email to fetch company details
          >
            <i className="fa fa-info-circle" style={{ fontSize: "17px" }} aria-hidden="true"></i>

            {/* Show Details */}
          </IconButton>
          &nbsp;
          <IconButton
            size="small"
            data-toggle="tooltip"
            title="Upload Questions"
            onClick={() => handleToggleUploadModal(params.row.id, params.row.testId)}
            style={{ marginRight: 8 }}
          >
            <i className="fa fa-upload" aria-hidden="true"></i>
            {/* Upload */}
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      {loader ? (
        <CircularProgress color="info" />
      ) : (
        <>
          {" "}
          <div style={{ paddingBottom: "10px", display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color=""
              style={{ backgroundColor: "#78b7f2", color: "white" }}
              onClick={handleDownload}
            >
              Sample Question Excel
            </Button>
          </div>
          {data.length > 0 ? (
            <DataGrid
              rows={rows}
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
            <div style={{ padding: "10px 15px", fontSize: "18px", fontWeight: "600" }}>
              Not found
            </div>
          )}
        </>
      )}
      <Modal open={open} onClose={handleCloseModel}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { lg: "70%", md: "98%", sm: "98%", xs: "98%" },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            maxHeight: "95vh",
            minHeight: "30vh",
            overflow: "auto",
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
                <h4>Test Details</h4>
                <span>
                  <i
                    className="fa fa-times"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleCloseModel();
                    }}
                    aria-hidden="true"
                  ></i>
                </span>
              </div>
              <hr />
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2} sx={{ mt: 0 }}>
                  <Grid item md={6} sm={6} xs={12}>
                    <h6 style={style.para}>
                      Test Name:{" "}
                      <span style={{ fontWeight: "normal" }}>{SelectedData.testName}</span>
                    </h6>
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <h6 style={style.para}>
                      Section Name:{" "}
                      <span style={{ fontWeight: "normal" }}>{SelectedData.sectionName}</span>
                    </h6>
                  </Grid>
                </Grid>

                <div
                  key={SelectedData.id}
                  style={{
                    marginBottom: "20px",
                    borderBottom: "2px solid #ddd",
                    paddingBottom: "10px",
                  }}
                >
                  <Grid container spacing={2} sx={{ mt: 0 }}>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                      <div style={style.para}>Time Limit: {SelectedData.timeLimit} min</div>
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                      <div style={style.para}>Total Questions: {SelectedData.noOfQuestions}</div>
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                      <div style={style.para}>
                        Marks Per Question: {SelectedData.marksPerQuestion}
                      </div>
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                      <div style={style.para}>Passing Marks: {SelectedData.passingMarks}</div>
                    </Grid>
                  </Grid>
                </div>

                {SelectedData?.questions?.length === 0 ? (
                  <div style={{ padding: "10px 15px", fontSize: "18px", fontWeight: "600" }}>
                    Question Not Added
                  </div>
                ) : (
                  <>
                    {/* show basic questions */}
                    <Box sx={{ boxShadow: 2, p: 1, m: 1, borderRadius: 2, mb: 4 }}>
                      <h6 style={style.para}>BASIC LEVEL QUESTIONS</h6>
                      <hr />
                      {SelectedData?.questions?.some(
                        (question, index) => question.questionLevel === "BASIC"
                      ) ? (
                        <>
                          {SelectedData?.questions?.map((question, index) => {
                            return (
                              question.questionLevel === "BASIC" && (
                                <div key={question.id} style={{ margin: "20px 0 10px 10px" }}>
                                  <div style={style.questions}>
                                    {basicserialNumber++}. {question.questionText}{" "}
                                    <span style={{ marginLeft: "15px" }}>
                                      <IconButton
                                        color="info"
                                        size="small"
                                        title="Edit Question"
                                        onClick={() => {
                                          handleQuestionEdit(question);
                                        }}
                                      >
                                        <Edit />
                                      </IconButton>
                                    </span>
                                  </div>
                                  <Box
                                    sx={{
                                      display: { lg: "flex", md: "flex", sm: "block" },
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    {["A", "B", "C", "D"].map((optionKey) => {
                                      if (
                                        question.questionType === "TRUE_FALSE" &&
                                        optionKey > "B"
                                      ) {
                                        return null; // Skip C and D for TRUE_FALSE
                                      }
                                      const optionValue = question[`option${optionKey}`];

                                      // Check if the answer is correct (for single and multiple answer types)
                                      const isCorrect =
                                        question.questionType !== "MULTIPLE_ANSWER"
                                          ? question.answer === optionKey
                                          : question.correctAnswers.includes(optionKey);

                                      return (
                                        <p
                                          key={optionKey}
                                          style={{
                                            marginLeft: "16px",
                                            ...style.answer,
                                            background: isCorrect ? "green" : "white",
                                            color: isCorrect ? "white" : "black",
                                          }}
                                        >
                                          {optionKey}:{" "}
                                          <span
                                            style={{
                                              color: isCorrect ? "white" : "gray",
                                            }}
                                          >
                                            {optionValue}
                                          </span>
                                        </p>
                                      );
                                    })}
                                  </Box>
                                </div>
                              )
                            );
                          })}
                        </>
                      ) : (
                        <div style={{ padding: "10px 15px", fontSize: "14px" }}>
                          Basic Level Question Not Added
                        </div>
                      )}{" "}
                    </Box>

                    {/* show Intermediate questions */}
                    <Box sx={{ boxShadow: 2, p: 1, m: 1, borderRadius: 2, mb: 4 }}>
                      <h6 style={style.para}>INTERMEDIATE LEVEL QUESTIONS</h6>
                      <hr />
                      {SelectedData?.questions?.some(
                        (question, index) => question.questionLevel === "INTERMEDIATE"
                      ) ? (
                        <>
                          {SelectedData?.questions?.map((question, index) => {
                            return (
                              question.questionLevel === "INTERMEDIATE" && (
                                <div key={question.id} style={{ margin: "20px 0 10px 10px" }}>
                                  <div style={style.questions}>
                                    {interserialNumber++}. {question.questionText}{" "}
                                    <span style={{ marginLeft: "15px" }}>
                                      <IconButton
                                        color="info"
                                        size="small"
                                        title="Edit Question"
                                        onClick={() => {
                                          handleQuestionEdit(question);
                                        }}
                                      >
                                        <Edit />
                                      </IconButton>
                                    </span>
                                  </div>
                                  <Box
                                    sx={{
                                      display: { lg: "flex", md: "flex", sm: "block" },
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    {["A", "B", "C", "D"].map((optionKey) => {
                                      if (
                                        question.questionType === "TRUE_FALSE" &&
                                        optionKey > "B"
                                      ) {
                                        return null; // Skip C and D for TRUE_FALSE
                                      }
                                      const optionValue = question[`option${optionKey}`];

                                      // Check if the answer is correct (for single and multiple answer types)
                                      const isCorrect =
                                        question.questionType !== "MULTIPLE_ANSWER"
                                          ? question.answer === optionKey
                                          : question.correctAnswers.includes(optionKey);

                                      return (
                                        <p
                                          key={optionKey}
                                          style={{
                                            marginLeft: "16px",
                                            ...style.answer,
                                            background: isCorrect ? "green" : "white",
                                            color: isCorrect ? "white" : "black",
                                          }}
                                        >
                                          {optionKey}:{" "}
                                          <span
                                            style={{
                                              color: isCorrect ? "white" : "gray",
                                            }}
                                          >
                                            {optionValue}
                                          </span>
                                        </p>
                                      );
                                    })}
                                  </Box>
                                </div>
                              )
                            );
                          })}
                        </>
                      ) : (
                        <div style={{ padding: "10px 15px", fontSize: "14px" }}>
                          Intermediate Level Question Not Added
                        </div>
                      )}{" "}
                    </Box>

                    {/* show Advanced questions */}
                    <Box sx={{ boxShadow: 2, p: 1, m: 1, borderRadius: 2, mb: 4 }}>
                      <h6 style={style.para}>ADVANCED LEVEL QUESTIONS</h6>
                      <hr />{" "}
                      {SelectedData?.questions?.some(
                        (question, index) => question.questionLevel === "ADVANCED"
                      ) ? (
                        <>
                          {SelectedData?.questions?.map((question, index) => {
                            return (
                              question.questionLevel === "ADVANCED" && (
                                <div key={question.id} style={{ margin: "20px 0 10px 10px" }}>
                                  <div style={style.questions}>
                                    {advserialNumber++}. {question.questionText}{" "}
                                    <span style={{ marginLeft: "15px" }}>
                                      <IconButton
                                        color="info"
                                        size="small"
                                        title="Edit Question"
                                        onClick={() => {
                                          handleQuestionEdit(question);
                                        }}
                                      >
                                        <Edit />
                                      </IconButton>
                                    </span>
                                  </div>
                                  <Box
                                    sx={{
                                      display: { lg: "flex", md: "flex", sm: "block" },
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    {["A", "B", "C", "D"].map((optionKey) => {
                                      if (
                                        question.questionType === "TRUE_FALSE" &&
                                        optionKey > "B"
                                      ) {
                                        return null; // Skip C and D for TRUE_FALSE
                                      }
                                      const optionValue = question[`option${optionKey}`];

                                      // Check if the answer is correct (for single and multiple answer types)
                                      const isCorrect =
                                        question.questionType !== "MULTIPLE_ANSWER"
                                          ? question.answer === optionKey
                                          : question.correctAnswers.includes(optionKey);

                                      return (
                                        <p
                                          key={optionKey}
                                          style={{
                                            marginLeft: "16px",
                                            ...style.answer,
                                            background: isCorrect ? "green" : "white",
                                            color: isCorrect ? "white" : "black",
                                          }}
                                        >
                                          {optionKey}:{" "}
                                          <span
                                            style={{
                                              color: isCorrect ? "white" : "gray",
                                            }}
                                          >
                                            {optionValue}
                                          </span>
                                        </p>
                                      );
                                    })}
                                  </Box>
                                </div>
                              )
                            );
                          })}
                        </>
                      ) : (
                        <div style={{ padding: "10px 15px", fontSize: "14px" }}>
                          Advanced Level Question Not Added
                        </div>
                      )}{" "}
                    </Box>
                  </>
                )}
              </Box>
            </div>
          </div>
        </Box>
      </Modal>
      {isAddModalOpen && (
        <AddQueTest
          selectedRowId={selectedRowId}
          selectedTestId={selectedTestId}
          handleClose={() => setIsAddModalOpen(false)}
          isAddModalOpen={isAddModalOpen}
          getTestDataApi={TestList}
          editData={editData}
        />
      )}
      {isUploadModalOpen && (
        <UploadQuestionExcelTest
          selectedRowId={selectedRowId}
          selectedTestId={selectedTestId}
          handleClose={() => setIsUploadModalOpen(false)}
          isUploadModalOpen={isUploadModalOpen}
          getTestDataApi={TestList}
        />
      )}
      {isEditModalOpen && editData && (
        <EditSection
          editData={editData}
          handleClose={() => setIsEditModalOpen(false)}
          getTestDataApi={TestList}
          isEditModalOpen={isEditModalOpen}
        />
      )}{" "}
      {isEditTestModalOpen && editData && (
        <EditTestName
          editData={editData}
          handleClose={() => setIsEditTestModalOpen(false)}
          getTestDataApi={TestList}
          isEditModalOpen={isEditTestModalOpen}
        />
      )}{" "}
      {isEditQuestionModalOpen && editData && (
        <EditQueTest
          editData={editData}
          handleClose={() => setIsEditQuestionModalOpen(false)}
          getTestDataApi={TestList}
          isEditModalOpen={isEditQuestionModalOpen}
          setSelectedData={setSelectedData}
          SelectedData={SelectedData}
        />
      )}
    </div>
  );
};
TestList.propTypes = {
  searchString: PropTypes.string, // Ensure it's a required string
};
TestList.defaultProps = {
  searchString: "",
};
