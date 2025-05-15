import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Button, MenuItem, Select, FormControl, InputLabel, CircularProgress } from "@mui/material";
import EditQue from "components/Modal/EditQue";
import { api } from "../../Api";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
const Reports = ({ searchString }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [collegeFilter, setCollegeFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // Default role filter: None

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [collegeList, setCollegeList] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  useEffect(() => {
    getCollege();
    fetchStudents();
  }, [roleFilter, collegeFilter]); // Fetch students whenever roleFilter or collegeFilter changes
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
  const fetchStudents = () => {
    if (roleFilter === "0" && collegeFilter === "") {
      return;
    }

    const role = roleFilter === "0" ? "0" : "10"; // Map role filter to appropriate value
    const collegeId = collegeFilter === "" ? "0" : collegeFilter; // Use "0" for "All" option
    setLoader(true);
    getStudentsApi(role, collegeId)
      .then((studentsData) => {
        setStudents(studentsData);
        setLoader(false);
        setFilteredStudents(studentsData);
        setFilterData(studentsData);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setLoader(false);
      });
  };

  const getStudentsApi = async (role, collegeId) => {
    try {
      const res = await axios.get(
        `${api}/newskill/getStudents?role=${role}&college_id=${collegeId}`
      );
      return res.data.students.map((student, index) => ({
        id: index + 1,
        name: student[0],
        email: student[1],
        phone: student[2],
        collegeId: student[4], // Assuming collegeId is retrieved from API response
      }));
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  };

  const handleRoleFilterChange = (event) => {
    const value = event.target.value;
    setRoleFilter(value);
    if (value === "0") {
      // If Internal Student is selected, ensure collegeFilter is not empty
      if (collegeFilter === "") {
        const Toast = Swal.mixin({
          toast: true,
          position: "center",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });

        Toast.fire({
          icon: "warning",
          title: "Please select a college for Internal Students.",
        });
      }
    }
    // Fetch students when role filter changes
    fetchStudents();
  };

  const handleCollegeFilterChange = (event) => {
    const value = event.target.value;
    setCollegeFilter(value);
    fetchStudents(); // Fetch students when college filter changes
  };
  useEffect(() => {
    if (searchString == "") {
      setFilteredStudents(filterdata);
    } else {
      const filterdatalist = filteredStudents.filter(
        (entry) =>
          entry?.name.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.email.toLowerCase().includes(searchString.toLowerCase())
      );

      setFilteredStudents(filterdatalist);
    }
  }, [searchString]);

  function exportToExcel(data, fileName = "data.xlsx") {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
  }

  const handleDownload = () => {
    exportToExcel(filteredStudents, "Reports.xlsx");
  };
  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  const columns = [
    { sortable: false, field: "id", headerName: "ID", width: 70 },
    { sortable: false, field: "name", headerName: "Name", width: 200 },
    { sortable: false, field: "email", headerName: "Email", width: 250 },
    { sortable: false, field: "phone", headerName: "Phone", width: 150 },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <FormControl
            style={{
              marginBottom: 16,
              marginRight: 10,
              minWidth: 120,
              width: "40%",
              color: "blue",
            }}
          >
            <InputLabel sx={{ color: "blue" }}>Select Role</InputLabel>
            <Select
              value={roleFilter}
              onChange={handleRoleFilterChange}
              sx={{ color: "blue", height: "44px" }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="0">Internal Student</MenuItem>
              <MenuItem value="10">External Student</MenuItem>
            </Select>
          </FormControl>
          <FormControl style={{ marginBottom: 16, minWidth: 120, width: "40%", color: "blue" }}>
            <InputLabel sx={{ color: "blue" }}>Select College</InputLabel>
            <Select
              value={collegeFilter}
              onChange={handleCollegeFilterChange}
              disabled={roleFilter !== "0"}
              sx={{ color: "blue", height: "44px" }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {collegeList?.length > 0 &&
                collegeList.map((item, ind) => (
                  <MenuItem key={ind} value={item.college_id}>
                    {item.college_name}
                  </MenuItem>
                ))}
              {/* <MenuItem value="1">RCERT</MenuItem>
            <MenuItem value="3">Vmv College</MenuItem> */}
            </Select>
          </FormControl>
        </div>
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
      </div>

      <div style={{ height: 400, width: "100%" }}>
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
        ) : filteredStudents.length > 0 ? (
          <DataGrid
            rows={filteredStudents}
            columns={columns}
            rowsPerPageOptions={[5, 10, 25]}
            pagination
            getRowId={(row) => row.id}
            paginationModel={paginationModel} // Make sure this is initialized correctly
            pageSize={paginationModel.pageSize}
            onPaginationModelChange={handlePaginationChange}
          />
        ) : (
          <div style={{ padding: "10px 15px", fontSize: "18px", fontWeight: "600" }}>Not found</div>
        )}

        {isEditModalOpen && editData && (
          <EditQue
            editData={editData}
            handleClose={() => setIsEditModalOpen(false)}
            fetchStudents={fetchStudents} // Pass fetchStudents function to refresh data after edit
          />
        )}
      </div>
    </>
  );
};
Reports.propTypes = {
  searchString: PropTypes.string, // Ensure it's a required string
};
Reports.defaultProps = {
  searchString: "",
};
export default Reports;
