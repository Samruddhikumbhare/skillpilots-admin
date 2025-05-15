import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AddQue from "components/Modal/AddQue";
import EditTest from "components/Modal/EditTest";
import { Box, Button, CircularProgress, IconButton, Modal } from "@mui/material";
import { api } from "../../Api";
import UploadQue from "components/Modal/uploadQuestion";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
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
const getOnlineTestDataApi = async () => {
  try {
    const res = await axios.get(api + "/newskill/getTest");
    const formattedData = res.data.Test.map((row) => ({
      ...row,
      id: row.tesId,
      creation_date: formatDate(row.creation_date),
      expiration_date: row.expiration_date ? formatDate(row.expiration_date) : "N/A",
    }));
    return formattedData;
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err;
  }
};

const OnlineTestList = ({ searchString }) => {
  const [data, setData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [filterdata, setFilterData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Current page
    pageSize: 5, // Rows per page
  });
  const [open, setOpen] = useState(false);
  const [SelectedData, setSelectedData] = useState({});

  useEffect(() => {
    TestList();
  }, []);

  const TestList = () => {
    getOnlineTestDataApi()
      .then((formattedData) => {
        setData(formattedData);
        setFilterData(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleToggleAddModal = (id) => {
    setSelectedRowId(id);
    setIsAddModalOpen((prev) => !prev);
  };

  const handleToggleEditModal = (id) => {
    const rowData = data.find((row) => row.id === id);
    setEditData(rowData);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(api + `/newskill/deleteTest?testId=${id}`);
      alert("Test Deleted Successfully");
      const updatedData = data.filter((row) => row.id !== id);
      setData(updatedData);
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };
  // *****************************activate user**************************
  const handleChangeStatus = (item) => {
    axios
      .patch(api + "/newskill/activate?testId=" + item.tesId)
      .then((res) => {
        Swal.fire({
          title: "Status Updated Successfully",
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
  const handleToggleUploadModal = (id) => {
    setSelectedRowId(id);
    setIsUploadModalOpen((prev) => !prev);
  };

  const handleSave = (updatedRow) => {
    const updatedData = data.map((row) => (row.id === updatedRow.id ? updatedRow : row));
    setData(updatedData);
    setIsEditModalOpen(false);
  };
  useEffect(() => {
    if (searchString == "") {
      setData(filterdata);
    } else {
      const filterdatalist = data.filter(
        (entry) =>
          entry?.testName.toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.total_que.toString().toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.mark_per_que.toString().toLowerCase().includes(searchString.toLowerCase()) ||
          entry?.status.toString().toLowerCase().includes(searchString.toLowerCase())
      );

      setData(filterdatalist);
    }
  }, [searchString]);

  function exportToExcel(data, fileName = "data.xlsx") {
    const headerMap = {
      testName: "Test Name",
      total_mark: "Total Marks",
      total_que: "Total Que",
      time: "Time",
      cut_off: "Cut Off",
      mark_per_que: "Marks/Que",
      status: "Status",
      creation_date: "Creation Date",
      expiration_date: "Expiration Date",
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
    exportToExcel(data, "onlinetest.xlsx");
  };
  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  const viewData = (item) => {
    setSelectedData(item);
    setOpen(true);
  };
  const handleCloseModel = () => setOpen(false);
  const columns = [
    { sortable: false, field: "testName", headerName: "Name", width: 190 },
    { sortable: false, field: "total_mark", headerName: "Total Marks", width: 100 },
    { sortable: false, field: "total_que", headerName: "Total Que", width: 90 },
    { sortable: false, field: "time", headerName: "Time", width: 70 },
    { sortable: false, field: "cut_off", headerName: "Cut Off", width: 70 },
    { sortable: false, field: "mark_per_que", headerName: "Marks/Que", width: 90 },
    { sortable: false, field: "status", headerName: "Status", width: 90 },
    { sortable: false, field: "creation_date", headerName: "Creation Date", width: 120 },
    { sortable: false, field: "expiration_date", headerName: "Expiration Date", width: 130 },
    {
      sortable: false,
      field: "actions",
      headerName: "Actions",
      width: 220,
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            data-toggle="tooltip"
            title="Add Que"
            onClick={() => handleToggleAddModal(params.row.id)}
            style={{ marginRight: 8 }}
          >
            <i className="fa fa-plus" aria-hidden="true"></i>
            {/* Add Que */}
          </IconButton>
          <IconButton
            size="small"
            data-toggle="tooltip"
            title="Edit"
            onClick={() => handleToggleEditModal(params.row.id)}
            style={{ marginRight: 8 }}
          >
            <i className="fa fa-pencil" style={{ color: "green" }} aria-hidden="true"></i>
            {/* Edit */}
          </IconButton>
          {params.row.status == false ? (
            <IconButton
              size="small"
              data-toggle="tooltip"
              title="De-Activate User"
              onClick={() => handleChangeStatus(params.row)}
              style={{ marginRight: 8 }}
            >
              <i className="fa fa-thumbs-down" aria-hidden="true"></i>
              {/* {deactive user} */}
            </IconButton>
          ) : (
            <IconButton
              size="small"
              data-toggle="tooltip"
              title="Activate User"
              onClick={() => handleChangeStatus(params.row)}
              style={{ marginRight: 8 }}
            >
              <i className="fa fa-thumbs-up" aria-hidden="true"></i>
              {/* {active user} */}
            </IconButton>
          )}
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
            title="Upload"
            onClick={() => handleToggleUploadModal(params.row.id)}
            style={{ marginRight: 8 }}
          >
            <i className="fa fa-upload" aria-hidden="true"></i>
            {/* Upload */}
          </IconButton>
          <IconButton
            size="small"
            data-toggle="tooltip"
            title="Delete"
            onClick={() => handleDelete(params.row.id)}
            style={{ marginRight: 8 }}
          >
            <i className="fa fa-trash" style={{ color: "red" }} aria-hidden="true"></i>
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
      {data.length > 0 ? (
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
          onPaginationModelChange={handlePaginationChange} // Handle both page and page size changes
        />
      ) : (
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
      )}
      <Modal open={open} onClose={handleCloseModel}>
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
                <h4>Online Test Details</h4>
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
              <br />
              <div>
                <div style={style.DetailsBoxMain}>
                  <div style={style.DetailsBoxChild}>
                    <label style={style.headingTitle}>Test Name : </label>
                    <span style={style.SubTitle}>{SelectedData.testName}</span>
                  </div>

                  <div style={style.DetailsBoxChild}>
                    <label style={style.headingTitle}>Total Mark : </label>
                    <span style={style.SubTitle}>{SelectedData.total_mark}</span>
                  </div>
                </div>

                <div style={style.DetailsBoxMain}>
                  <div style={style.DetailsBoxChild}>
                    <label style={style.headingTitle}>Total Question : </label>
                    <span style={style.SubTitle}>{SelectedData.total_que}</span>
                  </div>

                  <div style={style.DetailsBoxChild}>
                    <label style={style.headingTitle}>Time : </label>
                    <span style={style.SubTitle}>{SelectedData.time}</span>
                  </div>
                </div>

                <div style={style.DetailsBoxMain}>
                  <div style={style.DetailsBoxChild}>
                    <label style={style.headingTitle}>Cut off : </label>
                    <span style={style.SubTitle}>{SelectedData.cut_off}</span>
                  </div>
                  <div style={style.DetailsBoxChild}>
                    <label style={style.headingTitle}>Mark Per Question : </label>
                    <span style={style.SubTitle}>{SelectedData.mark_per_que}</span>
                  </div>
                </div>

                <div style={style.DetailsBoxMain}>
                  <div style={style.DetailsBoxChild}>
                    <label style={style.headingTitle}>Status : </label>
                    {SelectedData.status == true ? (
                      <span style={style.SubTitle}>Active</span>
                    ) : (
                      <span style={style.SubTitle}>In-Active</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      {isAddModalOpen && (
        <AddQue
          selectedRowId={selectedRowId}
          handleClose={() => setIsAddModalOpen(false)}
          isAddModalOpen={isAddModalOpen}
        />
      )}
      {isUploadModalOpen && (
        <UploadQue
          selectedRowId={selectedRowId}
          handleClose={() => setIsUploadModalOpen(false)}
          isUploadModalOpen={isUploadModalOpen}
        />
      )}
      {isEditModalOpen && editData && (
        <EditTest
          editData={editData}
          handleClose={() => setIsEditModalOpen(false)}
          handleSave={handleSave}
          getOnlineTestDataApi={TestList}
          isEditModalOpen={isEditModalOpen}
        />
      )}
    </div>
  );
};
OnlineTestList.propTypes = {
  searchString: PropTypes.string, // Ensure it's a required string
};
OnlineTestList.defaultProps = {
  searchString: "",
};
export default OnlineTestList;
