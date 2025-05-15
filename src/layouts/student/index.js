import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";
import { api } from "../../Api";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Modal,
  Box,
  Switch,
  Card,
} from "@mui/material";
import { debounce, filter, set } from "lodash";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

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

function AllStudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loader, setLoader] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all"); // Default role filter: None
  const [collegeList, setCollegeList] = useState([]);
  const [InternalData, setInternalData] = useState([]);
  const [CollegeValue, setCollegeValue] = useState("");
  const [DepartmentIdFilter, setDepartmentIdFilter] = useState("");
  const [rowCount, setRowCount] = useState(0); // Total number of items
  const [searchString, setsearchString] = useState("");
  const [studentLoader, setStudentLoader] = useState(false);
  const [SelectedCollegeList, setSelectedCollegeList] = useState([]);
  const [SelectedDepartment, setSelectedDepartment] = useState([]);
  const [filterValue, setfilterValue] = useState("");
  const [checkYear, setcheckYear] = useState("");
  const [showDownload, setShowDownload] = useState("All");
  const [dataGridState, setDataGridState] = useState({
    loading: false,
    pageSize: 10,
    offset: 1,
    amount: rowCount, // Total number of rows (replace with the total count from API)
    page: 0, // Default starting page (0-based index)
    totalRows: 10, // Total rows available for pagination
  });
  const [DepartmentList, setDepartmentList] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({}); // Store API response data here
  const [YearValue, setYearValue] = useState("");
  useEffect(() => {
    getStd(dataGridState);
    getCollege();
  }, []); // Fetch data on component mount
  const handleChangeSearch = (data) => {
    setsearchString(data);
    debouncedSearch(data);
  };
  const handleClose = () => setOpen(false);
  const viewStudent = (item) => {
    setOpen(true);
    setSelectedStudent(item.row);
  };
  const searchStudent = (debounceVal) => {
    axios
      .get(api + "/newskill/searchStudent?name=" + debounceVal)
      .then((res) => {
        const data = res.data?.students.map((item, index) => ({
          id: index + 1, // Add index value
          studentName: item.student_name,
          emailId: item.email_id,
          ...item,
        }));
        setStudents(data);

        setRowCount(res.data.totalItems);
        console.log("data found", res.data.students);
      })
      .catch((err) => {
        console.log("er", err);
      });
  };
  const debouncedSearch = useCallback(
    debounce((value) => {
      console.log("Searching for:", value);
      searchStudent(value);
      // Perform your API call or other actions here
    }, 500),
    [] // Empty dependency array to create the debounced function only once
  );

  const handlePaginationModelChange = async (paginationModel) => {
    const { pageSize, page } = paginationModel;
    getStd(dataGridState);
    setDataGridState((prevState) => ({
      ...prevState,
      pageSize,
      page,
      offset: page + 1, // Convert 0-based page index to 1-based
    }));
    if (roleFilter !== "") {
      getcollege(roleFilter);
    }
  };
  const getStd = async (dataGridState) => {
    setStudentLoader(true);
    try {
      const res = await axios.get(
        api +
          "/newskill/getAllStudent?page=" +
          dataGridState.offset +
          "&size=" +
          dataGridState.pageSize
      );
      const data = res.data?.students.map((item, index) => ({
        id: index + 1, // Add index value
        ...item,
        // status: "1",
      }));
      setStudentLoader(false);
      setStudents(data); // Update the state with the received students data

      setFilteredStudents(data);
      setRowCount(res?.data?.totalItems);
    } catch (error) {
      setStudentLoader(false);
      console.error("Error fetching students: ", error);
    }
  };

  // Calculate total pages
  // ************************excel sheet download**************************

  function exportToExcel(data, fileName = "data.xlsx") {
    console.log(data);
    const headerMap = {
      studentName: "Student Name",
      emailId: "Email Id",
      contact: "Contact Number",
      collegeName: "College Name",
      departmentName: "Department",
      year: "Year",
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
    if (showDownload == "All") {
      setLoader(true);
      axios
        .get(api + "/newskill/listStudents")
        .then((res) => {
          setLoader(false);
          console.log("res..", res.data);
          const studentdata = res.data.map((item) => {
            return {
              studentName: item.studentName,
              emailId: item.emailId,
              contact: item.contact,
              collegeName: item.collegeName,
              departmentName: item.departmentName,
              year: item?.year,
            };
          });
          exportToExcel(studentdata, "student_list.xlsx");
        })
        .catch((err) => {
          setLoader(false);
        });
    } else if (showDownload == "Internal") {
      setLoader(true);
      axios
        .get(api + "/newskill/getIntorExtStudent?collegeId=1")
        .then((res) => {
          setLoader(false);
          const studentdata = res.data.map((item) => {
            return {
              studentName: item.studentName,
              emailId: item.emailId,
              contact: item.contact,
              collegeName: item.collegeName,
              departmentName: item.departmentName,
              year: item?.year,
            };
          });
          exportToExcel(studentdata, "student_list.xlsx");
        })
        .catch((err) => {
          setLoader(false);
        });
    } else if (showDownload == "External") {
      setLoader(true);
      axios
        .get(api + "/newskill/getIntorExtStudent?collegeId=0")
        .then((res) => {
          setLoader(false);
          const studentdatalist = res.data.students.map((item) => {
            return {
              studentName: item.studentName,
              emailId: item.emailId,
              contact: item.contact,
              collegeName: item.collegeName,
              departmentName: item.departmentName,
              year: item?.year,
            };
          });
          exportToExcel(studentdatalist, "student_list.xlsx");
        })
        .catch((err) => {
          setLoader(false);
        });
    } else if (showDownload == "college") {
      setLoader(true);
      axios
        .get(api + "/newskill/filterByDept?collegeId=" + CollegeValue)
        .then((res) => {
          setLoader(false);
          const studentdataexcel = res.data.students.map((item) => {
            return {
              studentName: item?.studentName,
              emailId: item?.emailId,
              contact: item?.contact,
              collegeName: item?.collegeName,
              departmentName: item?.departmentName,
              year: item?.year,
            };
          });
          exportToExcel(studentdataexcel, "student_list.xlsx");
        })
        .catch((err) => {
          setLoader(false);
        });
    } else if (showDownload == "Department") {
      setLoader(true);
      axios
        .get(
          api + "/newskill/filterByDept?collegeId=" + CollegeValue + "&deptId=" + DepartmentIdFilter
        )
        .then((res) => {
          setLoader(false);
          const studentdata = res.data.students.map((item) => {
            return {
              studentName: item?.studentName,
              emailId: item?.emailId,
              contact: item?.contact,
              collegeName: item?.collegeName,
              departmentName: item?.departmentName,
              year: item?.year,
            };
          });
          exportToExcel(studentdata, "student_list.xlsx");
        })
        .catch((err) => {
          setLoader(false);
          // Swal.fire({
          //   title: "Download Failed",
          //   text: "",
          //   icon: "error",
          // });
        });
    } else if (showDownload == "Year") {
      setLoader(true);
      axios
        .get(
          api +
            "/newskill/filterByDept?collegeId=" +
            CollegeValue +
            "&deptId=" +
            DepartmentIdFilter +
            "&year=" +
            YearValue
        )
        .then((res) => {
          setLoader(false);
          const studentdata = res.data.students.map((item) => {
            return {
              studentName: item?.studentName,
              emailId: item?.emailId,
              contact: item?.contact,
              collegeName: item?.collegeName,
              departmentName: item?.departmentName,
              year: item?.year,
            };
          });
          exportToExcel(studentdata, "student_list.xlsx");
        })
        .catch((err) => {
          setLoader(false);
          // Swal.fire({
          //   title: "Download Failed",
          //   text: "",
          //   icon: "error",
          // });
        });
    }
  };
  const getCollege = () => {
    axios
      .get(api + "/newskill/findClj")
      .then((res) => {
        setCollegeList(res.data.colleges);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const getcollege = (value) => {
    axios
      .get(api + "/newskill/getIntorExtStudent?collegeId=" + value)
      .then((res) => {
        const data = res.data?.students.map((item, index) => ({
          id: index + 1, // Add index value
          ...item,
        }));
        setStudents(data);

        setInternalData(data);
        setRowCount(res.data.totalItems);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    setCollegeValue("");
    if (e.target.value == "1") {
      setShowDownload("Internal");
      getcollege(e.target.value);
    } else if (e.target.value == "0") {
      setShowDownload("External");
      getcollege(e.target.value);
    } else {
      getStd(dataGridState);
      setShowDownload("All");
      // setStudents(filteredStudents);
      setfilterValue("");
      setcheckYear("");
    }
  };
  const getDepartment = (collegeId) => {
    axios
      .get(api + "/newskill/dept?collegeId=" + collegeId)
      .then((res) => {
        setDepartmentList(res.data);
      })
      .then((err) => {
        console.error(err);
      });
  };

  const handleCollegeChange = (e) => {
    setCollegeValue(e.target.value);
    setDepartmentIdFilter("");
    if (e.target.value == "all") {
      setStudents(InternalData);
    } else {
      const filterCollege = InternalData.filter((item) => item.collegeId == e.target.value);
      setStudents(filterCollege);
      setShowDownload("college");
      setfilterValue("2");
      setSelectedCollegeList(filterCollege);
      getDepartment(e.target.value);
    }
  };
  const handleChangeDepartment = (e) => {
    setDepartmentIdFilter(e.target.value);
    setYearValue("");
    if (e.target.value == "all") {
      setStudents(SelectedCollegeList);
    } else {
      setShowDownload("Department");
      const filterCollege = SelectedCollegeList.filter((item) => item.deptId == e.target.value);
      setStudents(filterCollege);
      setRowCount(filterCollege.length);
      setcheckYear("3");
      setSelectedDepartment(filterCollege);
    }
  };
  const handleChangeYear = (e) => {
    setYearValue(e.target.value);
    if (e.target.value == "all") {
      setStudents(SelectedDepartment);
    } else {
      const filterCollege = SelectedDepartment.filter((item) => item.year == e.target.value);
      setStudents(filterCollege);
      setRowCount(filterCollege.length);
      setShowDownload("Year");
    }
  };

  const handleChangePassword = async (stuData) => {
    await axios
      .post(api + "/newskill/creates", { studentId: stuData.id })
      .then(async (response) => {
        await getStd();

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Status update successfully and sent password on mail.",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to change status. Please try again later.",
        });
      });
  };

  const columns = [
    // { sortable: false, field:  "id", headerName: "S-ID", width: 100 },
    { sortable: false, field: "studentName", headerName: "Name", width: 250 },
    { sortable: false, field: "emailId", headerName: "Email", width: 250 },
    { sortable: false, field: "contact", headerName: "Contact", width: 110 },
    { sortable: false, field: "collegeName", headerName: "College", width: 200 },
    { sortable: false, field: "departmentName", headerName: "Department", width: 150 },
    { sortable: false, field: "year", headerName: "Year", width: 100 },
    {
      sortable: false,
      field: "details",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <>
          {/* <Switch
            checked={params.row.status === "3" ? true : false}
            onChange={() => {
              console.log(params.row.status);
              if (params.row.status === "3") {
                handleChangePassword(params);
              }
            }}
            inputProps={{ "aria-label": "controlled" }}
          /> */}

          <Button
            data-toggle="tooltip"
            title="Show Details"
            variant="contained"
            size="small"
            style={{ background: "#3791ee", color: "white" }}
            color=""
            onClick={() => viewStudent(params)} // Pass the selected email to fetch company details
          >
            <i className="fa fa-info-circle" style={{ fontSize: "17px" }} aria-hidden="true"></i>

            {/* Show Details */}
          </Button>
        </>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar onDataSend={handleChangeSearch} />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card sx={{ p: 1, pt: 2 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "60%", display: "flex", gap: "10px" }}>
                  <FormControl style={{ marginBottom: 16, marginRight: 10, width: "30%" }}>
                    <InputLabel sx={{ color: "blue" }}>Select Role</InputLabel>
                    <Select
                      label="Select Role"
                      value={roleFilter}
                      onChange={handleRoleChange}
                      name="role"
                      id="role"
                      sx={{ color: "blue", height: "44px" }}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="1">Internal Student</MenuItem>
                      <MenuItem value="0">External Student</MenuItem>
                    </Select>
                  </FormControl>
                  {roleFilter == "1" ? (
                    <FormControl style={{ marginBottom: 16, minWidth: 120, width: "30%" }}>
                      <InputLabel sx={{ color: "blue" }}>Select College</InputLabel>
                      <Select
                        label="Select College"
                        value={CollegeValue}
                        onChange={handleCollegeChange}
                        name="collegevalue"
                        id="collegeValue"
                        sx={{ color: "blue", height: "44px" }}
                      >
                        {/* <MenuItem value="all">All</MenuItem> */}
                        {collegeList?.length > 0 &&
                          collegeList.map((item, ind) => (
                            <MenuItem key={ind} value={item.college_id}>
                              {item.college_name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  ) : null}
                  {filterValue == "2" ? (
                    <FormControl style={{ marginBottom: 16, minWidth: 120, width: "30%" }}>
                      <InputLabel sx={{ color: "blue" }}>Select Department</InputLabel>
                      <Select
                        label="Select Department"
                        value={DepartmentIdFilter}
                        onChange={handleChangeDepartment}
                        name="Departmentvalue"
                        id="DepartmentValue"
                        sx={{ color: "blue", height: "44px" }}
                      >
                        {/* <MenuItem value="all">All</MenuItem> */}
                        {DepartmentList?.length > 0 &&
                          DepartmentList.map((item, ind) => (
                            <MenuItem key={ind} value={item.id}>
                              {item.deptName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  ) : null}
                  {checkYear == "3" ? (
                    <FormControl style={{ marginBottom: 16, minWidth: 120, width: "30%" }}>
                      <InputLabel sx={{ color: "blue" }}>Select Year</InputLabel>
                      <Select
                        label="Select Year"
                        onChange={handleChangeYear}
                        value={YearValue}
                        name="Year"
                        id="year"
                        sx={{ color: "blue", height: "44px" }}
                      >
                        {/* <MenuItem value="all">All</MenuItem> */}
                        <MenuItem value="1st Year">1st Year</MenuItem>
                        <MenuItem value="2nd Year">2nd Year</MenuItem>
                        <MenuItem value="3rd Year">3rd Year</MenuItem>
                        <MenuItem value="4th Year">4th Year</MenuItem>
                      </Select>
                    </FormControl>
                  ) : null}
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <div>
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
                  ) : null}
                </div>
              </div>
              {studentLoader ? (
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
              ) : students?.length > 0 ? (
                <div style={{ width: "100%", height: "auto" }}>
                  <DataGrid
                    rows={students}
                    columns={columns}
                    loading={dataGridState.loading}
                    getRowId={(row) => row.id} // Use studentId as the unique key for rows
                    rowCount={rowCount}
                    disableColumnMenu
                    sx={{
                      "& .MuiDataGrid-columnSeparator": {
                        display: "none !important", // Hide the column resize handles
                      },
                    }}
                    pageSize={dataGridState.pageSize}
                    paginationModel={{
                      page: dataGridState.page,
                      pageSize: dataGridState.pageSize,
                    }} // Set initial pagination model
                    onPaginationModelChange={handlePaginationModelChange} // Handle both page and page size changes
                    paginationMode="server" // Enable server-side pagination
                  />
                </div>
              ) : (
                <div>No students found</div>
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
                  <div>
                    <div>
                      <div
                        style={{
                          paddingBottom: "8px",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h4>Student Details</h4>
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
                          <div style={style.DetailsBoxChildM}>
                            <label style={style.headingTitle}>Name : </label>
                            <span style={style.SubTitle}>{selectedStudent?.studentName}</span>
                          </div>
                        </div>
                        <div style={style.DetailsBoxMain}>
                          <div style={style.DetailsBoxChild}>
                            <label style={style.headingTitle}>Email : </label>
                            <span style={style.SubTitle}>{selectedStudent?.emailId}</span>
                          </div>
                          <div style={style.DetailsBoxChild}>
                            <label style={style.headingTitle}>Contact : </label>
                            <span style={style.SubTitle}>{selectedStudent?.contact}</span>
                          </div>
                        </div>
                        <div style={style.DetailsBoxMain}>
                          <div style={style.DetailsBoxChildM}>
                            <label style={style.headingTitle}>College : </label>
                            <span style={style.SubTitle}>{selectedStudent?.collegeName}</span>
                          </div>
                        </div>
                        <div style={style.DetailsBoxMain}>
                          <div style={style.DetailsBoxChild}>
                            <label style={style.headingTitle}>Department : </label>
                            <span style={style.SubTitle}>{selectedStudent?.departmentName}</span>
                          </div>
                          <div style={style.DetailsBoxChild}>
                            <label style={style.headingTitle}>Year : </label>
                            <span style={style.SubTitle}>{selectedStudent?.year}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Box>
              </Modal>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AllStudentList;
