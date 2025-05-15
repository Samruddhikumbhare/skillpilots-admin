import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { api } from "../../Api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
} from "@mui/material";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const getDepartmentDataApi = async () => {
  try {
    const res = await axios.get(api + "/newskill/getDept");
    const formattedData = res.data.DeptList.map((row, index) => ({
      ...row,
      id: row.deptId, // Make sure id maps to deptId
      creationDate: formatDate(row.creationDate),
    }));
    return formattedData;
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};

const DepartmentList = ({ searchString }) => {
  const [data, setData] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedDepartment, setEditedDepartment] = useState(null);
  const [filterdata, setFilterData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setLoader(true);
    getDepartmentDataApi()
      .then((formattedData) => {
        setData(formattedData);
        setLoader(false);
        setFilterData(formattedData);
      })
      .catch((err) => {
        setLoader(false);
      });
  }, []);

  const handleDelete = async (deptId) => {
    try {
      const resp = await axios.delete(api + `/newskill/deleteDept?deptId=${deptId}`);
      getDepartmentDataApi().then((formattedData) => setData(formattedData));
      alert("Department Deleted Successfully");
    } catch (err) {
      console.log("Error fetching department:", err);
    }
  };

  const handleEdit = (deptId) => {
    const selectedDept = data.find((dept) => dept.id === deptId);
    setEditedDepartment(selectedDept);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setEditedDepartment(null);
    setOpenEditModal(false);
  };
  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };
  useEffect(() => {
    if (searchString == "") {
      setData(filterdata);
    } else {
      const filterdatalist = data.filter(
        (entry) =>
          entry?.dept_name.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.dept_type.toLowerCase().includes(searchString.toLowerCase())
      );

      setData(filterdatalist);
    }
  }, [searchString]);

  function exportToExcel(data, fileName = "data.xlsx") {
    const headerMap = {
      dept_name: "Department Name",
      dept_type: "Department Type",
      creationDate: "Creation Date",
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
    exportToExcel(data, "Department.xlsx");
  };
  const handleSaveChanges = async () => {
    try {
      if (!editedDepartment) {
        return;
      }

      const { deptId, dept_name, dept_type } = editedDepartment;
      const payload = { dept_name, dept_type };

      const resp = await axios.put(api + `/newskill/editDept?deptId=${deptId}`, payload);

      getDepartmentDataApi().then((formattedData) => setData(formattedData));
      setOpenEditModal(false);
      alert("Changes saved successfully");
    } catch (err) {
      console.log("Error updating department:", err);
    }
  };

  const handleInputChange = (e) => {
    if (!editedDepartment) {
      return;
    }
    const { name, value } = e.target;
    setEditedDepartment({ ...editedDepartment, [name]: value });
  };

  const columns = [
    { sortable: false, field: "dept_name", headerName: "Department Name", width: 350 },
    { sortable: false, field: "dept_type", headerName: "Department Type", width: 200 },
    { sortable: false, field: "creationDate", headerName: "Creation Date", width: 200 },
    {
      sortable: false,
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <>
          <IconButton
            // variant="contained"
            data-toggle="tooltip"
            title="Edit"
            color="info"
            size="small"
            onClick={() => handleEdit(params.row.deptId)}
          >
            {/* Edit */}
            <i
              className="fa fa-pencil"
              style={{ fontSize: "17px", color: "green" }}
              aria-hidden="true"
            ></i>
          </IconButton>
          &nbsp;
          <IconButton
            // variant="contained"
            data-toggle="tooltip"
            title="Delete"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.deptId)}
          >
            <i
              className="fa fa-trash"
              style={{ fontSize: "17px", color: "red" }}
              aria-hidden="true"
            ></i>
            {/* Delete */}
          </IconButton>
        </>
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
          getRowId={(row) => row.id}
          paginationModel={paginationModel} // Make sure this is initialized correctly
          pageSize={paginationModel.pageSize}
          onPaginationModelChange={handlePaginationChange}
        />
      ) : (
        <div style={{ padding: "10px 15px", fontSize: "18px", fontWeight: "600" }}>Not found</div>
      )}

      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent>
          {editedDepartment && (
            <>
              <TextField
                margin="dense"
                id="dept_name"
                name="dept_name"
                label="Department Name"
                fullWidth
                value={editedDepartment.dept_name}
                onChange={handleInputChange}
                sx={{ mt: 1 }}
              />
              <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
                <InputLabel id="dept-type-label">Department Type</InputLabel>
                <Select
                  labelId="dept-type-label"
                  id="dept_type"
                  name="dept_type"
                  margin="dense"
                  label="Department Type"
                  value={editedDepartment.dept_type}
                  onChange={handleInputChange}
                  sx={{
                    minHeight: "48px", // Ensures better spacing
                  }}
                >
                  <MenuItem value="UG">Under Graduate</MenuItem>
                  <MenuItem value="PG">Post Graduate</MenuItem>
                  <MenuItem value="diploma">Diploma</MenuItem>
                  <MenuItem value="phd">PHD</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            sx={{ color: "white !important" }}
          >
            Save Changes
          </Button>
          <Button
            onClick={handleCloseEditModal}
            variant="contained"
            sx={{ color: "white !important" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

DepartmentList.propTypes = {
  searchString: PropTypes.string, // Ensure it's a required string
};
DepartmentList.defaultProps = {
  searchString: "",
};

export default DepartmentList;
