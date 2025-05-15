import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { api } from "../../Api";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import useMediaQuery from "@mui/material/useMediaQuery";
import Swal from "sweetalert2";
import { Edit } from "@mui/icons-material";

export const getPlanDataApi = async () => {
  try {
    const res = await axios.get(api + "/newskill/plans");
    if (res.data) {
      console.log(res.data.plans);
      const formattedData = res.data.plans.map((row, index) => ({
        id: index + 1,
        planId: row.planId,
        planName: row.planName,
        user: row.user,
        amount: row.amount,
        totalAmt: row.totalAmt,
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

const PricingPlansList = ({ searchString }) => {
  const isScreenLarge = useMediaQuery("(max-width:700px)");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  // Modal state
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [editData, setEditData] = useState({ planName: "", user: "", amount: "" });

  useEffect(() => {
    setLoader(true);
    getPlanDataApi()
      .then((formattedData) => {
        console.log(formattedData);
        setData(formattedData);
        setFilterData(formattedData);
        setLoader(false);
      })
      .catch(() => setLoader(false));
  }, []);

  useEffect(() => {
    if (searchString === "") {
      setData(filterData);
    } else {
      const filteredList = filterData.filter(
        (entry) =>
          entry.planName.toLowerCase().includes(searchString.toLowerCase()) ||
          entry.user.toLowerCase().includes(searchString.toLowerCase()) ||
          entry.amount.toLowerCase().includes(searchString.toLowerCase())
      );
      setData(filteredList);
    }
  }, [searchString, filterData]);

  // Handle Pagination
  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  // Open Edit Modal
  const handleEditClick = (row) => {
    console.log(row);
    setSelectedPlan(row);
    setEditData({ planName: row.planName, user: row.user, amount: row.amount });
    setOpen(true);
  };

  // Handle Change in Modal Inputs
  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Submit Updated Data to API
  const handleUpdate = async () => {
    await axios
      .put(api + "/newskill/updatePlan", {
        ...editData,
        planId: selectedPlan.planId,
        amount: Number(editData.amount),
      })
      .then(async (response) => {
        setOpen(false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Pricing Plans Update Successfully.",
          showConfirmButton: true,
        }).then(async () => {
          getPlanDataApi()
            .then((formattedData) => {
              console.log(formattedData);
              setData(formattedData);
              setFilterData(formattedData);
              setLoader(false);
            })
            .catch(() => setLoader(false));
        });
      })
      .catch((error) => {
        setOpen(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add pricing plan. Please try again later.",
          showConfirmButton: true,
        });
      });
  };

  const columns = [
    { sortable: false, field: "id", headerName: "Sr.", width: 50 },
    { sortable: false, field: "planName", headerName: "Plan Name", width: 200 },
    { sortable: false, field: "user", headerName: "Total User", width: 150 },
    { sortable: false, field: "amount", headerName: "Amount", width: 150 },
    { sortable: false, field: "totalAmt", headerName: "Final Amount (with 18%)", width: 250 },
    {
      sortable: false,
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <IconButton color="info" size="small" onClick={() => handleEditClick(params.row)}>
          <Edit />
        </IconButton>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      {/* <div style={{ paddingBottom: "10px", display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" style={{ backgroundColor: "#78b7f2", color: "white" }}>
          Download Excel
        </Button>
      </div> */}

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
          // getRowId={(row) => row.planId}
          paginationModel={paginationModel}
          pageSize={paginationModel.pageSize}
          onPaginationModelChange={handlePaginationChange}
        />
      ) : (
        <div style={{ padding: "10px 15px", fontSize: "18px", fontWeight: "600" }}>Not found</div>
      )}

      {/* Edit Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Plan</DialogTitle>
        <DialogContent>
          <TextField
            label="Plan Name"
            name="planName"
            fullWidth
            margin="dense"
            value={editData.planName}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Total User"
            name="user"
            fullWidth
            margin="dense"
            value={editData.user}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Amount"
            name="amount"
            fullWidth
            margin="dense"
            value={editData.amount}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            sx={{ color: "white !important" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

PricingPlansList.propTypes = {
  searchString: PropTypes.string,
};

PricingPlansList.defaultProps = {
  searchString: "",
};

export default PricingPlansList;
